import ProviderLogger from "@/logger"
import { consoleTransport } from "@/logger/transports/console"
import {
  AnthropicChatCompletionParams,
  AnthropicChatCompletionParamsNonStream,
  AnthropicChatCompletionParamsStream,
  ExtendedCompletionAnthropic,
  ExtendedCompletionChunkAnthropic,
  LogLevel,
  OpenAILikeClient
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI, { ClientOptions } from "openai"

/**
 * AnthropicProvider is a class that provides an interface for interacting with the Anthropic API.
 * It implements the OpenAILikeClient interface and allows users to create chat completions using
 * the Anthropic API.
 */
export class AnthropicProvider extends Anthropic implements OpenAILikeClient<"anthropic"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"
  private logger: ProviderLogger

  /**
   * Constructs a new instance of the AnthropicProvider class.
   * @param opts - An optional ClientOptions object containing the API key.
   */
  constructor(
    opts?: ClientOptions & {
      logLevel?: LogLevel
    }
  ) {
    const apiKey = opts?.apiKey ?? process.env?.["ANTHROPIC_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for AnthropicProvider - please provide it in the constructor or set it as an environment variable named ANTHROPIC_API_KEY."
      )
    }

    super({ apiKey })

    this.logLevel = opts?.logLevel ?? this.logLevel
    this.apiKey = apiKey
    this.logger = new ProviderLogger("GEMINI-CLIENT")
    this.logger.addTransport(consoleTransport)
  }
  [key: string]: unknown

  /**
   * Transforms the Anthropic API response into an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   * @param result - The Anthropic API response.
   * @param stream - An optional parameter indicating whether the response is a stream.
   * @returns A Promise that resolves to an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   */
  private async transformResponse(
    result: Anthropic.Messages.Message,
    { stream }: { stream?: boolean } = {}
  ): Promise<ExtendedCompletionAnthropic | ExtendedCompletionChunkAnthropic> {
    if (!result.id) throw new Error("Response id is undefined")
    this.logger.log("debug", `Response: ${result}`)

    result.content.forEach(content => {
      content.type === "tool_use"
        ? this.logger.log("debug", `JSON Summary: ${JSON.stringify(content.input, null, 2)}`)
        : this.logger.log(
            "debug",
            `No JSON summary found in the response. 
            ${JSON.stringify(content, null, 2)}`
          )
    })

    const transformedResponse = {
      id: result.id,
      originResponse: result,
      model: result.model,
      usage: {
        prompt_tokens: result.usage.input_tokens,
        completion_tokens: result.usage.output_tokens,
        total_tokens: result.usage.input_tokens + result.usage.output_tokens
      }
    }

    if (!stream) {
      const toolUseBlocks = result.content.filter(
        block => block.type === "tool_use"
      ) as Anthropic.ToolUseBlock[]

      const resultTextBlocks = result.content.filter(
        block => block.type === "text"
      ) as Anthropic.TextBlock[]

      const tool_calls = toolUseBlocks.map(block => ({
        id: block.id,
        type: "function",
        function: {
          name: block.name,
          arguments: JSON.stringify(block.input)
        }
      }))

      const content = resultTextBlocks.map(choice => choice.text).join("")

      return {
        ...transformedResponse,
        object: "chat.completion",
        choices: [
          {
            message: {
              role: "assistant",
              content,
              ...(tool_calls?.length ? { tool_calls } : {})
            },
            finish_reason: tool_calls?.length ? "tool_calls" : "stop",
            index: 0,
            logprobs: null
          } as OpenAI.ChatCompletion.Choice
        ]
      }
    }

    return transformedResponse
  }

  /**
   * Transforms the OpenAI chat completion parameters into Anthropic chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Anthropic chat completion parameters.
   */
  private transformParamsRegular(
    params: AnthropicChatCompletionParams
  ): Anthropic.Messages.MessageCreateParams {
    let tools: Anthropic.Tool[] = []

    const systemMessages = params.messages.filter(message => message.role === "system")

    const messages = params.messages.filter(
      message => message.role === "user" || message.role === "assistant"
    ) as Anthropic.MessageParam[]

    const system = systemMessages?.length
      ? systemMessages.map(message => message.content).join("\n")
      : ""

    if (systemMessages.length) {
      console.warn(
        "Anthropic does not support system messages - concatenating them all into a single 'system' property."
      )
    }

    if (!params.max_tokens) {
      throw new Error("max_tokens is required")
    }

    if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
      tools = params.tools.map(tool => ({
        name: tool.function.name ?? "",
        description: tool.function.description ?? "",
        input_schema: {
          type: "object",
          ...tool.function.parameters
        }
      }))
    }

    return {
      model: params.model,
      tools,
      system: system?.length ? system : undefined,
      messages,
      max_tokens: params.max_tokens,
      stop_sequences: params.stop
        ? Array.isArray(params.stop)
          ? params.stop
          : [params.stop]
        : undefined,
      temperature: params.temperature ?? undefined,
      top_p: params.top_p ?? undefined,
      top_k: params.n ?? undefined,
      stream: params?.stream ?? false,
      tool_choice:
        "tool_choice" in params &&
        typeof params.tool_choice === "object" &&
        "function" in params.tool_choice
          ? {
              type: "tool",
              name: params.tool_choice.function.name
            }
          : undefined
    }
  }

  /**
   * Streams the chat completion response from the Anthropic API.
   * @param response - The Response object from the Anthropic API.
   * @returns An asynchronous iterable of ExtendedCompletionChunkAnthropic objects.
   */
  private async *streamChatCompletion(
    response: AsyncIterable<Anthropic.MessageStreamEvent>
  ): AsyncIterable<ExtendedCompletionChunkAnthropic> {
    let finalChatCompletion: ExtendedCompletionChunkAnthropic | null = null

    for await (const event of response) {
      switch (event.type) {
        case "message_start":
          this.logger.log("debug", `Message start: ${event}`)
          finalChatCompletion = {
            id: event.message.id,
            object: "chat.completion.chunk",
            created: Date.now(),
            model: event.message.model,
            choices: [
              {
                index: 0,
                delta: { role: "assistant" },
                finish_reason: null
              }
            ],
            usage: {
              prompt_tokens: event.message.usage.input_tokens,
              completion_tokens: 0,
              total_tokens: event.message.usage.input_tokens
            },
            originResponse: event.message
          }

          yield finalChatCompletion
          break

        case "content_block_start":
          this.logger.log("debug", `Content block start: ${event}`)
          break

        case "content_block_delta":
          if (finalChatCompletion && finalChatCompletion.choices) {
            if (event.delta.type === "text_delta") {
              finalChatCompletion.choices[0].delta = {
                content: event.delta.text,
                role: "assistant"
              }
            } else if (event.delta.type === "input_json_delta") {
              finalChatCompletion.choices[0].delta = {
                content: event.delta.partial_json,
                role: "assistant"
              }
            }

            yield finalChatCompletion
          }
          break

        case "content_block_stop":
          this.logger.log("debug", `Content block stop: ${event}`)
          break

        case "message_delta":
          if (finalChatCompletion && finalChatCompletion.usage) {
            finalChatCompletion.usage.completion_tokens = event.usage?.output_tokens || 0
            finalChatCompletion.usage.total_tokens =
              finalChatCompletion.usage.prompt_tokens + finalChatCompletion.usage.completion_tokens
          }
          break

        case "message_stop":
          this.logger.log("debug", `Message stop: ${event}`)
          if (finalChatCompletion && finalChatCompletion.choices) {
            finalChatCompletion.choices[0].finish_reason = "stop"
            finalChatCompletion.choices[0].delta = {
              content: null,
              role: "assistant"
            }
            yield finalChatCompletion
          }
          break

        default:
          this.logger.log("warn", `Unknown event type: ${event}`)
      }
    }
  }
  /**
   * Creates a chat completion using the Anthropic API.
   * @param params - The chat completion parameters.
   * @returns A Promise that resolves to an ExtendedCompletionAnthropic object or an asynchronous iterable of ExtendedCompletionChunkAnthropic objects if streaming is enabled.
   */
  public async create(
    params: AnthropicChatCompletionParamsStream
  ): Promise<AsyncIterable<ExtendedCompletionChunkAnthropic>>

  public async create(
    params: AnthropicChatCompletionParamsNonStream
  ): Promise<ExtendedCompletionAnthropic>

  public async create(
    params: AnthropicChatCompletionParams
  ): Promise<AsyncIterable<ExtendedCompletionChunkAnthropic> | ExtendedCompletionAnthropic> {
    try {
      const anthropicParams = this.transformParamsRegular(params)

      if (params.stream) {
        this.logger.log("debug", "Starting streaming completion response")

        const messageStream = await this.messages.stream({
          ...anthropicParams
        })

        return this.streamChatCompletion(messageStream)
      } else {
        const result = await this.messages.create({
          ...anthropicParams,
          stream: false
        })

        const transformedResult = await this.transformResponse(result)

        return transformedResult as ExtendedCompletionAnthropic
      }
    } catch (error) {
      this.logger.error(new Error("Error in Anthropic API request:", { cause: error }))
      throw error
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }
}
