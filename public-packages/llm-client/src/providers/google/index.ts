import {
  ExtendedCompletionChunkGoogle,
  ExtendedCompletionGoogle,
  GoogleChatCompletionParams,
  GoogleChatCompletionParamsNonStream,
  GoogleChatCompletionParamsStream,
  LogLevel,
  OpenAILikeClient,
  Role
} from "@/types"
import {
  Content,
  EnhancedGenerateContentResponse,
  FunctionCallingMode,
  FunctionDeclarationsTool,
  GenerateContentRequest,
  GoogleGenerativeAI,
  TextPart,
  Tool
} from "@google/generative-ai"
import { ClientOptions } from "openai"

export class GoogleProvider extends GoogleGenerativeAI implements OpenAILikeClient<"google"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"

  private log<T extends unknown[]>(level: LogLevel, ...args: T) {
    const timestamp = new Date().toISOString()
    switch (level) {
      case "debug":
        if (this.logLevel === "debug") {
          console.debug(`[LLM-CLIENT--GOOGLE-CLIENT:DEBUG] ${timestamp}:`, ...args)
        }
        break
      case "info":
        if (this.logLevel === "debug" || this.logLevel === "info") {
          console.info(`[LLM-CLIENT--GOOGLE-CLIENT:INFO] ${timestamp}:`, ...args)
        }
        break
      case "warn":
        if (this.logLevel === "debug" || this.logLevel === "info" || this.logLevel === "warn") {
          console.warn(`[LLM-CLIENT--GOOGLE-CLIENT:WARN] ${timestamp}:`, ...args)
        }
        break
      case "error":
        console.error(`[LLM-CLIENT--GOOGLE-CLIENT:ERROR] ${timestamp}:`, ...args)
        break
    }
  }

  constructor(
    opts?: ClientOptions & {
      logLevel?: LogLevel
    }
  ) {
    const apiKey = opts?.apiKey ?? process.env?.["GOOGLE_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for GoogleProvider - please provide it in the constructor or set it as an environment variable named GEMINI_API_KEY."
      )
    }

    super(apiKey)

    this.logLevel = opts?.logLevel ?? this.logLevel
    this.apiKey = apiKey
  }

  /**
   * Transforms the OpenAI chat completion parameters into Google chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Google chat completion parameters.
   */
  private transformParams(params: GoogleChatCompletionParams): GenerateContentRequest {
    let function_declarations: FunctionDeclarationsTool[] = []

    // TODO - add system messages to request
    // const systemMessages = params.messages.filter(message => message.role === "system")
    // const system = systemMessages?.length
    //   ? systemMessages.map(message => message.content).join("\n")
    //   : ""

    // if (systemMessages.length) {
    //   console.warn(
    //     "Google does not support system messages - concatenating them all into a single 'system' property."
    //   )
    // }

    // conform messages to Google's Content[] type
    // they use "model" and "user" instead of "assistant" and "user", and also have no "system" role
    const contents: Content[] = params.messages
      .filter(message => message.role !== "system")
      .map(message => {
        const textPart: TextPart = {
          text: message.content.toString()
        }
        return {
          role: message.role === "assistant" ? "model" : "user",
          parts: [textPart]
        }
      })

    if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
      function_declarations = params.tools.map(
        tool =>
          ({
            name: tool.function.name ?? "",
            description: tool.function.description ?? "",
            parameters: tool.function.parameters
          }) as FunctionDeclarationsTool
      )
    }

    return {
      contents,
      tools: [{ function_declarations } as Tool],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.ANY,
          allowedFunctionNames: ["say_hello"]
        }
      }
    }
  }

  /**
   * Transforms the Google API response into an ExtendedCompletionGoogle or ExtendedCompletionChunkGoogle object.
   * @param response - The Google API response.
   * @param stream - An optional parameter indicating whether the response is a stream.
   * @returns A Promise that resolves to an ExtendedCompletionGoogle or ExtendedCompletionChunkGoogle object.
   */
  private async transformResponse(
    response: EnhancedGenerateContentResponse,
    { stream }: { stream?: boolean } = {}
  ): Promise<ExtendedCompletionGoogle | ExtendedCompletionChunkGoogle> {
    const responseText = response.text()
    const functionCalls = response.functionCalls()

    const tool_calls = functionCalls?.map((block, index) => ({
      index,
      id: "",
      type: "function",
      function: {
        name: block.name,
        arguments: JSON.stringify(block.args)
      }
    }))

    const transformedResponse = {
      id: "",
      originResponse: response,
      //model: result.model, //TODO: add model
      usage: {
        prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        completion_tokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        total_tokens:
          (response.usageMetadata?.promptTokenCount ?? 0) +
          (response.usageMetadata?.candidatesTokenCount ?? 0)
      }
    }

    const responseDataChunk = {
      role: "assistant" as Role,
      content: responseText,
      ...(tool_calls?.length ? { tool_calls } : {})
    }

    const finish_reason = tool_calls?.length ? "tool_calls" : "stop"

    if (stream) {
      return {
        ...transformedResponse,
        object: "chat.completion.chunk",
        choices: [
          {
            delta: responseDataChunk,
            finish_reason,
            index: 0
          }
        ]
      } as ExtendedCompletionChunkGoogle
    } else {
      return {
        ...transformedResponse,
        object: "chat.completion",
        choices: [
          {
            message: responseDataChunk,
            finish_reason,
            index: 0,
            logprobs: null
          }
        ]
      } as ExtendedCompletionGoogle
    }
  }

  /**
   * Streams the chat completion response from the Google API.
   * @param response - The Response object from the Google API.
   * @returns An asynchronous iterable of ExtendedCompletionChunkGoogle objects.
   */
  private async *streamChatCompletion(
    stream: AsyncIterable<EnhancedGenerateContentResponse>
  ): AsyncIterable<ExtendedCompletionChunkGoogle> {
    for await (const chunk of stream) {
      yield (await this.transformResponse(chunk, { stream: true })) as ExtendedCompletionChunkGoogle
    }
  }

  public async create(
    params: GoogleChatCompletionParamsStream
  ): Promise<AsyncIterable<ExtendedCompletionChunkGoogle>>

  public async create(
    params: GoogleChatCompletionParamsNonStream
  ): Promise<ExtendedCompletionGoogle>

  public async create(
    params: GoogleChatCompletionParams
  ): Promise<ExtendedCompletionGoogle | AsyncIterable<ExtendedCompletionChunkGoogle>> {
    try {
      if (!params?.model || !params?.messages?.length) {
        throw new Error("model and messages are required")
      }

      const googleParams = this.transformParams(params)
      const generativeModel = this.getGenerativeModel({ model: params?.model })

      if (params?.stream) {
        this.log("debug", "Starting streaming completion response")

        const result = await generativeModel.generateContentStream(googleParams)

        if (!result?.stream) {
          throw new Error("generateContentStream failed")
        }

        return this.streamChatCompletion(result.stream)
      } else {
        const result = await generativeModel.generateContent(googleParams)

        if (!result?.response) {
          throw new Error("generateContent failed")
        }

        const transformedResult = await this.transformResponse(result.response, {
          stream: false
        })

        return transformedResult as ExtendedCompletionGoogle
      }
    } catch (error) {
      console.error("Error in Google API request:", error)
      throw error
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }
}
