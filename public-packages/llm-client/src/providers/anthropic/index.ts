import {
  LLMClientCreateParams,
  AnthropicApiKey,
  AnthropicChatCompletion,
  AnthropicChatCompletionChunk,
  AnthropicExtendedChatCompletion,
  AnthropicExtendedChatCompletionChunk,
  AnthropicChatCompletionParams,
  AnthropicExtendedChatCompletionParams,
  AnthropicChatCompletionStreamingParams
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { BaseProvider } from "@/providers/base"

/**
 * Represents a wrapper around the Anthropic client from the Anthropic SDK
 * for TS that can be interacted with using the OpenAI API
 */
export class AnthropicProvider extends BaseProvider<"anthropic"> {

  constructor(opts: LLMClientCreateParams) {
    super(opts)
  }

  private createClient(
    authOpts: AnthropicApiKey
  ): Anthropic {
    const apiKey = authOpts?.anthropicApiKey ?? process.env?.ANTHROPIC_API_KEY ?? null
    
    if (!apiKey) {
      throw new Error("Invalid authentication provided for Anthropic. Please \
see README for information on client authentication"
      )
    }

    return new Anthropic({ apiKey })
  }

  [key: string]: unknown

  private async transformResponse(
    result: AnthropicChatCompletion,
    { stream }: { stream?: boolean } = {}
  ): Promise<AnthropicExtendedChatCompletion | AnthropicExtendedChatCompletionChunk> {
    if (!result.id) throw new Error("Response id is undefined")
    this.log("debug", "Response:", result)

    result.content.forEach(content => {
      content.type === "tool_use"
        ? this.log("debug", "JSON Summary:", JSON.stringify(content.input, null, 2))
        : this.log(
            "debug",
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
    params: AnthropicExtendedChatCompletionParams
  ): AnthropicChatCompletionParams {
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
    params: AnthropicExtendedChatCompletionParams
  ): AnthropicChatCompletionStreamingParams {
    //@ts-expect-error if tools get passed in even if type errors throw, we should explictly throw here
    if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
      throw new Error("Streaming is not currently supported with tools in the Anthropic API.")
    }

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
  private async *transformResultingStream(
    response: AsyncIterable<AnthropicChatCompletionChunk>
  ): AsyncIterable<AnthropicExtendedChatCompletionChunk> {
    let finalChatCompletion: AnthropicExtendedChatCompletionChunk | null = null

    for await (const data of response) {
      switch (data.type) {
        case "message_start":
          this.log("debug", "Message start:", data)
          finalChatCompletion = (await this.transformResponse(data.message, {
            stream: true
          })) as AnthropicExtendedChatCompletionChunk 

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

            yield finalChatCompletion as AnthropicExtendedChatCompletionChunk
          }
          continue

        case "content_block_stop":
          this.log("debug", "Content block stop:", data)

          if (finalChatCompletion && finalChatCompletion.choices) {
            finalChatCompletion.choices[0].finish_reason = "stop"
          }

          yield finalChatCompletion as AnthropicExtendedChatCompletionChunk
          continue

        case "message_stop":
          this.log("debug", "Message stop:", data)
      }
    }
  }

  private async clientStreamChatCompletions(
    anthropicParams: AnthropicChatCompletionStreamingParams
  ): AsyncIterable<AnthropicChatCompletionChunk> {
    const result = await this.client.messages.stream({
      ...anthropicParams
    })

    return result as AsyncIterable<AnthropicChatCompletionChunk> 
  }

  private async clientChatCompletions(
    anthropicParams: AnthropicChatCompletionParams
  ): AnthropicChatCompletion {
    const result = await this.client.beta.tools.messages.create(
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

    return result
  }
}
