import {
  AnthropicChatCompletionParams,
  AnthropicChatCompletionParamsNonStream,
  AnthropicChatCompletionParamsStream,
  ExtendedCompletionAnthropic,
  ExtendedCompletionChunkAnthropic,
  OpenAILikeClient
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI, { ClientOptions } from "openai"

export type LogLevel = "debug" | "info" | "warn" | "error"

/**
 * AnthropicProvider is a class that provides an interface for interacting with the Anthropic API.
 * It implements the OpenAILikeClient interface and allows users to create chat completions using
 * the Anthropic API.
 */
export class AnthropicProvider extends Anthropic implements OpenAILikeClient<"anthropic"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"

  private log<T extends unknown[]>(level: LogLevel, ...args: T) {
    const timestamp = new Date().toISOString()
    switch (level) {
      case "debug":
        if (this.logLevel === "debug") {
          console.debug(`[LLM-CLIENT--ANTHROPIC-CLIENT:DEBUG] ${timestamp}:`, ...args)
        }
        break
      case "info":
        if (this.logLevel === "debug" || this.logLevel === "info") {
          console.info(`[LLM-CLIENT--ANTHROPIC-CLIENT:INFO] ${timestamp}:`, ...args)
        }
        break
      case "warn":
        if (this.logLevel === "debug" || this.logLevel === "info" || this.logLevel === "warn") {
          console.warn(`[LLM-CLIENT--ANTHROPIC-CLIENT:WARN] ${timestamp}:`, ...args)
        }
        break
      case "error":
        console.error(`[LLM-CLIENT--ANTHROPIC-CLIENT:ERROR] ${timestamp}:`, ...args)
        break
    }
  }

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
  }

  /**
   * Transforms the Anthropic API response into an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   * @param result - The Anthropic API response.
   * @param stream - An optional parameter indicating whether the response is a stream.
   * @returns A Promise that resolves to an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   */
  private async transformResponse(
    result: Anthropic.Messages.Message | Anthropic.Beta.Tools.Messages.ToolsBetaMessage,
    { stream }: { stream?: boolean } = {}
  ): Promise<ExtendedCompletionAnthropic | ExtendedCompletionChunkAnthropic> {
    if (!result.id) throw new Error("Response id is undefined")
    this.log("debug", "Response:", result)

    result.content.forEach(content => {
      content.type === "tool_use"
        ? this.log("info", "JSON Summary:", JSON.stringify(content.input, null, 2))
        : this.log(
            "info",
            "No JSON summary found in the response.",
            JSON.stringify(content, null, 2)
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
      ) as Anthropic.Beta.Tools.ToolUseBlock[]

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
    } else {
      return {
        ...transformedResponse,
        object: "chat.completion.chunk",
        choices: [
          {
            delta: {
              content: ""
            },
            finish_reason: null,
            index: 0
          }
        ]
      }
    }
  }

  /**
   * Transforms the OpenAI chat completion parameters into Anthropic chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Anthropic chat completion parameters.
   */
  private transformParamsRegular(
    params: AnthropicChatCompletionParams
  ): Anthropic.Beta.Tools.Messages.MessageCreateParamsNonStreaming {
    let tools: Anthropic.Beta.Tools.Tool[] = []

    const systemMessages = params.messages.filter(message => message.role === "system")

    const messages = params.messages.filter(
      message => message.role === "user" || message.role === "assistant"
    ) as Anthropic.Beta.Tools.ToolsBetaMessageParam[]

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

    if (
      "tool_choice" in params &&
      typeof params.tool_choice === "object" &&
      "function" in params.tool_choice
    ) {
      messages[messages.length - 1].content +=
        `\n\nUse the ${params.tool_choice.function.name} tool in your response`
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
      stream: false
    }
  }

  private transformParamsStream(
    params: AnthropicChatCompletionParams
  ): Anthropic.Messages.MessageCreateParamsStreaming {
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

    return {
      model: params.model,
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
      stream: true
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

    for await (const data of response) {
      switch (data.type) {
        case "message_start":
          this.log("debug", "Message start:", data)
          finalChatCompletion = (await this.transformResponse(data.message, {
            stream: true
          })) as ExtendedCompletionChunkAnthropic

          yield finalChatCompletion
          continue

        case "content_block_delta":
          if (data.delta && data.delta.text) {
            if (finalChatCompletion && finalChatCompletion.choices) {
              if (data.delta.text) {
                finalChatCompletion.choices[0].delta = {
                  content: data.delta.text,
                  role: "assistant"
                }
              }
            }

            yield finalChatCompletion as ExtendedCompletionChunkAnthropic
          }
          continue

        case "content_block_stop":
          this.log("debug", "Content block stop:", data)

          if (finalChatCompletion && finalChatCompletion.choices) {
            finalChatCompletion.choices[0].finish_reason = "stop"
          }

          yield finalChatCompletion as ExtendedCompletionChunkAnthropic
          continue

        case "message_stop":
          this.log("debug", "Message stop:", data)
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
      if (params.stream) {
        //@ts-expect-error if tools get passed in even if type errors throw, we should explictly throw here
        if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
          throw new Error("Streaming is not currently supported with tools in the Anthropic API.")
        }

        const anthropicParams = this.transformParamsStream(params)
        this.log("debug", "Starting streaming completion response")

        const messageStream = await this.messages.stream({
          ...anthropicParams
        })

        return this.streamChatCompletion(messageStream)
      } else {
        const anthropicParams = this.transformParamsRegular(params)

        const result = await this.beta.tools.messages.create(
          {
            ...anthropicParams,
            stream: false
          },
          {
            headers: {
              "anthropic-beta": "tools-2024-04-04"
            }
          }
        )

        const transformedResult = await this.transformResponse(result)

        return transformedResult as ExtendedCompletionAnthropic
      }
    } catch (error) {
      console.error("Error in Anthropic API request:", error)
      throw error
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }
}
