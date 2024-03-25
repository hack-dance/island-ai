import {
  AnthropicChatCompletionParams,
  ExtendedCompletionAnthropic,
  ExtendedCompletionChunkAnthropic,
  OpenAILikeClient
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI, { ClientOptions } from "openai"

import { FunctionCallExtractor, JSONSchema7Definition, renderParameter } from "./fns"

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

/**
 * AnthropicProvider is a class that provides an interface for interacting with the Anthropic API.
 * It implements the OpenAILikeClient interface and allows users to create chat completions using
 * the Anthropic API.
 */
export class AnthropicProvider implements OpenAILikeClient<"anthropic"> {
  public apiKey: string
  public baseURL: string = "https://api.anthropic.com/v1"
  public models = anthropicModels

  /**
   * Constructs a new instance of the AnthropicProvider class.
   * @param opts - An optional ClientOptions object containing the API key.
   */
  constructor(opts?: ClientOptions) {
    const apiKey = opts?.apiKey ?? process.env?.["ANTHROPIC_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for AnthropicProvider - please provide it in the constructor or set it as an environment variable named ANTHROPIC_API_KEY."
      )
    }

    this.apiKey = apiKey
  }

  /**
   * Builds an API request using the provided URL, method, and body.
   * @param url - The URL of the API endpoint.
   * @param method - The HTTP method to use for the request.
   * @param body - The request body.
   * @returns A Promise that resolves to the Response object.
   */
  private async buildApiRequest<B>(params: {
    url: string
    method: string
    body: B
  }): Promise<Response> {
    const { url, method, body } = params
    const headers = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      "anthropic-version": "2023-06-01"
    }

    try {
      return fetch(`${this.baseURL}/${url}`, {
        method,
        headers,
        body: JSON.stringify(body)
      })
    } catch (error) {
      console.error("Error in Anthropic API request:", error)
      throw error
    }
  }

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
    const extractor = new FunctionCallExtractor()
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
  ): AnthropicMessageCompletionPayload {
    const systemMessages = params.messages.filter(
      (message: OpenAI.ChatCompletionMessageParam) => message.role === "system"
    )
    const supportedMessages = params.messages.filter(
      (message: OpenAI.ChatCompletionMessageParam) => message.role !== "system"
    )

    const messages = supportedMessages.map((message: OpenAI.ChatCompletionMessageParam) => ({
      role: message.role,
      content: message.content
    })) as AnthropicMessage[]

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
          const parameterXML = renderParameter(tool.function.parameters as JSONSchema7Definition)
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
    response: Response,
    { toolChoice }: { toolChoice?: string }
  ): AsyncIterable<ExtendedCompletionChunkAnthropic> {
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error("Failed to get stream reader")
    }

    const extractor = new FunctionCallExtractor()
    let finalChatCompletion: ExtendedCompletionChunkAnthropic | null = null

    const decoder = new TextDecoder("utf-8")

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.trim() === "") continue

          if (line.startsWith("data:")) {
            const [_, eventData] = line.split("data:")

            if (!eventData) {
              console.warn("Skipping line without event data:", line)
              continue
            }

            const data = JSON.parse(eventData.trim())

            switch (data.type) {
              case "message_start":
                finalChatCompletion = (await this.transformResponse(data.message, {
                  stream: true
                })) as ExtendedCompletionChunkAnthropic

                yield finalChatCompletion
                continue

              case "content_block_delta":
                if (data.delta && data.delta.text) {
                  if (finalChatCompletion && finalChatCompletion.choices) {
                    if (data.delta.text && !toolChoice) {
                      finalChatCompletion.choices[0].delta = {
                        content: data.delta.text,
                        role: "assistant"
                      }
                    }

                    const functionCalls = extractor.extractFunctionCalls(data.delta.text)
                    const functionCallsDefault =
                      functionCalls?.length > 0
                        ? functionCalls
                        : toolChoice
                          ? [
                              {
                                functionName: toolChoice,
                                args: {}
                              }
                            ]
                          : []

                    finalChatCompletion.choices[0].delta.tool_calls = functionCallsDefault.map(
                      ({ functionName, args }, index) => ({
                        index,
                        function: {
                          name: functionName,
                          arguments: `${JSON.stringify(args ?? {})}`
                        }
                      })
                    )
                  }

                  yield finalChatCompletion as ExtendedCompletionChunkAnthropic
                }

                continue

              case "content_block_stop":
                if (finalChatCompletion && finalChatCompletion.choices) {
                  finalChatCompletion.choices[0].delta = {}
                  finalChatCompletion.choices[0].finish_reason = "stop"
                }

                yield finalChatCompletion as ExtendedCompletionChunkAnthropic

                break

              case "message_stop":
                break
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in stream:", error)
      throw error
    } finally {
      reader.releaseLock()
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
    const anthropicParams = this.transformParams(params)

    try {
      const response = await this.buildApiRequest({
        url: "messages",
        method: "POST",
        body: anthropicParams
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Anthropic API request failed:", error)
        throw new Error(`Anthropic API request failed: ${response.statusText}`)
      }

      if (params.stream) {
        return this.streamChatCompletion(response, {
          toolChoice:
            typeof params?.tool_choice === "object" && "function" in params?.tool_choice
              ? params?.tool_choice?.function?.name
              : undefined
        })
      } else {
        const result: Anthropic.Messages.Message = await response.json()
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
