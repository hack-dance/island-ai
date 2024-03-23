import {
  AnthropicModels,
  ExtendedCompletionAnthropic,
  ExtendedCompletionChunkAnthropic,
  OpenAILikeClient
} from "@/types"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI, { ClientOptions } from "openai"

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

export class AnthropicProvider implements OpenAILikeClient<"anthropic"> {
  public apiKey: string
  public baseURL: string = "https://api.anthropic.com/v1"
  public models = anthropicModels

  constructor(opts?: ClientOptions) {
    const apiKey = opts?.apiKey ?? process.env?.["ANTHROPIC_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for AnthropicProvider - please provide it in the constructor or set it as an environment variable named ANTHROPIC_API_KEY."
      )
    }

    this.apiKey = apiKey
  }

  private async buildApiRequest<B>({
    url,
    method,
    body
  }: {
    url: string
    method: string
    body: B
  }): Promise<Response> {
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

  private async callFunction(functionName: string, _args: string): Promise<string> {
    // Implement the logic to execute the function based on the functionName and arguments
    // Return the function result as a string
    // For example:
    // if (functionName === "get_weather") {
    //   const { location } = JSON.parse(arguments);
    //   const weather = await getWeather(location);
    //   return JSON.stringify(weather);
    // }
    // ...
    throw new Error(`Function '${functionName}' not implemented`)
  }

  private extractFunctionCalls(text: string): Array<{ functionName: string; args: string }> {
    const functionCallsRegex = /<function_calls>(.*?)<\/function_calls>/gs
    const matches = text.matchAll(functionCallsRegex)
    const functionCalls = []

    for (const match of matches) {
      const functionCallXml = match[1]
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(functionCallXml, "text/xml")
      const invokeElements = Array.from(xmlDoc.getElementsByTagName("invoke"))

      for (const invokeElement of invokeElements) {
        const functionName = invokeElement.getElementsByTagName("tool_name")[0].textContent || "" // Fix applied here
        const parameterElements = Array.from(
          invokeElement.getElementsByTagName("parameters")[0].children
        )

        const parameters: Record<string, any> = {}

        for (const parameterElement of parameterElements) {
          const parameterName = parameterElement.tagName
          const parameterValue = parameterElement.textContent
          parameters[parameterName] = parameterValue
        }

        const args = JSON.stringify(parameters)
        functionCalls.push({ functionName, args })
      }
    }

    return functionCalls
  }

  private formatFunctionResults(functionName: string, result: string): string {
    return `<function_results>
      <result>
        <tool_name>${functionName}</tool_name>
        <stdout>${result}</stdout>
      </result>
    </function_results>`
  }

  private async transformResponse(
    result: Anthropic.Messages.Message,
    { stream }: { stream?: boolean } = {}
  ): Promise<ExtendedCompletionAnthropic | ExtendedCompletionChunkAnthropic> {
    if (!result.id) throw new Error("Response id is undefined")

    let transformedResponse = {
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
      const functionCalls = this.extractFunctionCalls(content)
      let updatedContent = content

      for (const { functionName, args } of functionCalls) {
        const functionResult = await this.callFunction(functionName, args)
        const formattedResult = this.formatFunctionResults(functionName, functionResult)
        updatedContent = updatedContent.replace(
          /<function_calls>.*?<\/function_calls>/s,
          formattedResult
        )
      }

      return {
        ...transformedResponse,
        object: "chat.completion",
        choices: [
          {
            message: {
              role: "assistant",
              content: updatedContent
            },
            finish_reason: "stop",
            index: 0,
            logprobs: null
          }
        ]
      }
    } else {
      const content = result.content.map(choice => choice.text).join("")
      const functionCalls = this.extractFunctionCalls(content)
      let updatedContent = content

      for (const { functionName, args } of functionCalls) {
        const functionResult = await this.callFunction(functionName, args)
        const formattedResult = this.formatFunctionResults(functionName, functionResult)
        updatedContent = updatedContent.replace(
          /<function_calls>.*?<\/function_calls>/s,
          formattedResult
        )
      }

      return {
        ...transformedResponse,
        object: "chat.completion.chunk",
        choices: [
          {
            delta: {
              role: "assistant",
              content: updatedContent
            },
            finish_reason: null,
            index: 0
          }
        ]
      }
    }
  }

  private transformParams(
    params: OpenAI.ChatCompletionCreateParams
  ): AnthropicMessageCompletionPayload {
    const systemMessages = params.messages.filter((message: any) => message.role === "system")
    const supportedMessages = params.messages.filter((message: any) => message.role !== "system")
    let system = systemMessages?.length
      ? systemMessages.map((message: any) => message.content).join("\n")
      : ""

    if (systemMessages.length) {
      console.warn(
        "Anthropic does not support system messages - concatenating them all into a single 'system' property."
      )
    }

    if (!params.max_tokens) {
      throw new Error("max_tokens is required")
    }

    if (
      params.tool_choice &&
      typeof params.tool_choice === "object" &&
      "function" in params.tool_choice &&
      params.tool_choice.function.name
    ) {
      system += `\n\n<tool_choice><function><name>${params.tool_choice.function.name}</name></function></tool_choice>\n`
    }

    if (params.tools && params.tools.length > 0) {
      system +=
        "<tools>\n" +
        params.tools
          .map(tool => {
            const parameterXML = Object.entries(tool.function.parameters?.["properties"] ?? {})
              .map(
                ([name, schema]) => `<parameter>
              <name>${name}</name>
              ${schema?.type ? `<type>${schema.type}</type>` : ""}
              ${schema?.description ? `<description>${schema.description}</description>` : ""}
            </parameter>`
              )
              .join("\n")

            return `<tool_description>
            <tool_name>${tool.function.name}</tool_name>
            <description>${tool.function.description}</description>
            <parameters>${parameterXML}</parameters>
          </tool_description>`
          })
          .join("\n") +
        "\n</tools>"
    }

    return {
      model: params.model,
      system: system?.length ? system : undefined,
      messages: supportedMessages.map((message: any) => ({
        role: message.role,
        content: message.content
      })),
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

  private async *streamChatCompletion(
    response: Response
  ): AsyncGenerator<ExtendedCompletionChunkAnthropic, void, undefined> {
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error("Failed to get stream reader")
    }

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
                break

              case "content_block_delta":
                if (data.delta && data.delta.text) {
                  if (finalChatCompletion && finalChatCompletion.choices) {
                    finalChatCompletion.choices[0].delta = {
                      content: data.delta.text,
                      role: "assistant"
                    }
                  }

                  yield finalChatCompletion as ExtendedCompletionChunkAnthropic
                }
                break

              case "content_block_stop":
                if (finalChatCompletion && finalChatCompletion.choices) {
                  // const functionCalls = this.extractFunctionCalls(currentContentDelta)
                  // let updatedContent = currentContentDelta

                  // for (const { functionName, args } of functionCalls) {
                  //   const functionResult = await this.callFunction(functionName, args)
                  //   const formattedResult = this.formatFunctionResults(functionName, functionResult)
                  //   updatedContent = updatedContent.replace(
                  //     /<function_calls>.*?<\/function_calls>/s,
                  //     formattedResult
                  //   )
                  // }

                  finalChatCompletion.choices[0].delta.content = ""
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

  public async create(
    params: Omit<OpenAI.Chat.ChatCompletionCreateParams, "model"> & {
      model: AnthropicModels
      stream: true
    }
  ): Promise<AsyncGenerator<ExtendedCompletionChunkAnthropic, void, undefined>>

  public async create(
    params: Omit<OpenAI.Chat.ChatCompletionCreateParams, "model"> & { model: AnthropicModels }
  ): Promise<ExtendedCompletionAnthropic>

  public async create(
    params: Omit<OpenAI.Chat.ChatCompletionCreateParams, "model"> & {
      model: AnthropicModels
      stream?: boolean
    }
  ): Promise<
    AsyncGenerator<ExtendedCompletionChunkAnthropic, void, undefined> | ExtendedCompletionAnthropic
  > {
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
        return this.streamChatCompletion(response) as AsyncGenerator<
          ExtendedCompletionChunkAnthropic,
          void,
          undefined
        >
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
