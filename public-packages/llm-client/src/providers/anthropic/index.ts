import {
  AnthropicChatCompletionParams,
  AnthropicModels,
  ExtendedCompletionAnthropic,
  ExtendedCompletionChunkAnthropic,
  OpenAILikeClient
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import { MessageStream } from "@anthropic-ai/sdk/lib/MessageStream.mjs"
import OpenAI, { ClientOptions } from "openai"

import { FunctionCallExtractor, JSONSchema7Object, renderParameter } from "./fns"

export const anthropicModels = ["claude-3-opus-20240229", "claude-3-sonnet-20240229"]

export type AnthropicMessageContentBlock = {
  type: "text" | "image"
  text?: string
  source?: {
    type: "base64"
    media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp"
    data: string
  }
}

export type AnthropicMessageContent = string | AnthropicMessageContentBlock[]

export type AnthropicMessageRole = "user" | "assistant"

export type AnthropicMessage = {
  role: AnthropicMessageRole
  content: AnthropicMessageContent
}

export type AnthropicMessageCompletionPayload = {
  model: string
  messages: AnthropicMessage[]
  system?: string
  max_tokens: number
  metadata?: {
    user_id?: string
  }
  stop_sequences?: string[]
  stream?: boolean
  temperature?: number
  top_p?: number
  top_k?: number
}

export type LogLevel = "debug" | "info" | "warn" | "error"

/**
 * AnthropicProvider is a class that provides an interface for interacting with the Anthropic API.
 * It implements the OpenAILikeClient interface and allows users to create chat completions using
 * the Anthropic API.
 */
export class AnthropicProvider extends Anthropic implements OpenAILikeClient<"anthropic"> {
  public apiKey: string
  public models = anthropicModels as AnthropicModels[]
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
    result: Anthropic.Messages.Message,
    params: AnthropicChatCompletionParams,
    { stream }: { stream?: boolean } = {}
  ): Promise<ExtendedCompletionAnthropic | ExtendedCompletionChunkAnthropic> {
    if (!result.id) throw new Error("Response id is undefined")

    const toolChoice =
      typeof params?.tool_choice === "object" && "function" in params?.tool_choice
        ? params?.tool_choice?.function?.name
        : undefined

    const schema = (params.tools ?? []).find(tool => tool.function.name === toolChoice)?.function
      ?.parameters as JSONSchema7Object

    const extractor = new FunctionCallExtractor(schema, {
      logger: this.log.bind(this)
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
      const content = result.content.map(choice => choice.text).join("")
      const functionCalls = extractor.extractFunctionCalls(content) ?? []
      const tool_calls = functionCalls.map(({ functionName, args }, index) => ({
        id: `${index}-${functionName}`,
        type: "function" as const,
        function: {
          name: functionName,
          arguments: JSON.stringify(args)
        }
      }))

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
          }
        ]
      }
    } else {
      return {
        ...transformedResponse,
        object: "chat.completion.chunk",
        choices: [
          {
            delta: {},
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
  private transformParams(
    params: OpenAI.ChatCompletionCreateParams
  ):
    | Anthropic.Messages.MessageCreateParamsStreaming
    | Anthropic.Messages.MessageCreateParamsNonStreaming {
    const systemMessages = params.messages.filter(
      (message: OpenAI.ChatCompletionMessageParam) => message.role === "system"
    )
    const supportedMessages = params.messages.filter(
      (message: OpenAI.ChatCompletionMessageParam) => message.role !== "system"
    )

    const messages = supportedMessages.map((message: OpenAI.ChatCompletionMessageParam) => ({
      role: message.role,
      content: message.content
    })) as Anthropic.MessageParam[]

    let system = systemMessages?.length
      ? systemMessages
          .map((message: OpenAI.ChatCompletionMessageParam) => message.content)
          .join("\n")
      : ""

    if (systemMessages.length) {
      console.warn(
        "Anthropic does not support system messages - concatenating them all into a single 'system' property."
      )
    }

    if (!params.max_tokens) {
      throw new Error("max_tokens is required")
    }

    if (params.tools && params.tools.length > 0) {
      system += `
      In this environment you have access to a set of tools you can use to answer the user's question.

      You may call them like this:

      <function_calls>
      <invoke>
      <tool_name>$TOOL_NAME</tool_name>
      <parameters>
      <$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
      ...
      </parameters>
      </invoke>
      </function_calls>

      Here are the tools available:
      <tools>
      ${params.tools
        .map(tool => {
          const parameterXML = renderParameter(tool.function.parameters as JSONSchema7Object)
          return `<tool_description>
            <tool_name>${tool.function.name}</tool_name>
            <description>${tool.function.description}</description>
            <parameters>${parameterXML}</parameters>
          </tool_description>`
        })
        .join("\n")}
    </tools>`
    }

    if (
      params.tool_choice &&
      typeof params.tool_choice === "object" &&
      "function" in params.tool_choice &&
      params.tool_choice.function.name
    ) {
      system += `//(System request): \n\n<tool_choice><tool_name>${params.tool_choice.function.name}</tool_name></tool_choice>\n`
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
      stream: params.stream ?? false
    }
  }

  /**
   * Streams the chat completion response from the Anthropic API.
   * @param response - The Response object from the Anthropic API.
   * @returns An asynchronous iterable of ExtendedCompletionChunkAnthropic objects.
   */
  private async *streamChatCompletion(
    response: MessageStream,
    { toolChoice, params }: { toolChoice?: string; params: AnthropicChatCompletionParams }
  ): AsyncIterable<ExtendedCompletionChunkAnthropic> {
    const schema = toolChoice
      ? ((params.tools ?? []).find(tool => tool.function.name === toolChoice)?.function
          ?.parameters as JSONSchema7Object)
      : undefined

    const extractor = schema
      ? new FunctionCallExtractor(schema, {
          logger: this.log.bind(this)
        })
      : undefined

    let finalChatCompletion: ExtendedCompletionChunkAnthropic | null = null

    for await (const data of response) {
      switch (data.type) {
        case "message_start":
          this.log("debug", "Message start:", data)
          finalChatCompletion = (await this.transformResponse(data.message, params, {
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

              if (extractor) {
                const functionCalls = extractor.extractFunctionCalls(data.delta.text)
                finalChatCompletion.choices[0].delta.tool_calls =
                  finalChatCompletion.choices[0].delta.tool_calls = functionCalls.map(
                    ({ functionName, args }, index) => ({
                      index,
                      function: {
                        name: functionName,
                        arguments: `${JSON.stringify(args)}`
                      }
                    })
                  )
              }
            }

            yield finalChatCompletion as ExtendedCompletionChunkAnthropic
          }

          continue

        case "content_block_stop":
          this.log("debug", "Content block stop:", data)

          if (finalChatCompletion && finalChatCompletion.choices) {
            // finalChatCompletion.choices[0].delta = {}
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
    params: Omit<AnthropicChatCompletionParams, "stream"> & {
      stream: true
    }
  ): Promise<AsyncIterable<ExtendedCompletionChunkAnthropic>>

  public async create(params: AnthropicChatCompletionParams): Promise<ExtendedCompletionAnthropic>

  public async create(
    params: AnthropicChatCompletionParams
  ): Promise<AsyncIterable<ExtendedCompletionChunkAnthropic> | ExtendedCompletionAnthropic> {
    try {
      if (params.stream) {
        const anthropicParams = this.transformParams(params)
        this.log("debug", "Starting streaming completion response")
        const messageStream = await this.messages.stream({
          ...anthropicParams
        })

        return this.streamChatCompletion(messageStream, {
          params,
          toolChoice:
            typeof params?.tool_choice === "object" && "function" in params?.tool_choice
              ? params?.tool_choice?.function?.name
              : undefined
        })
      } else {
        const anthropicParams = this.transformParams(params)
        const result = await this.messages.create({
          ...anthropicParams,
          stream: false
        })

        const transformedResult = await this.transformResponse(result, params)

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
