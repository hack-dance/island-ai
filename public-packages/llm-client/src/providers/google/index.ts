import {
  ExtendedCompletionChunkGoogle,
  ExtendedCompletionGoogle,
  GooggleCacheCreateParams,
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
import { GoogleAICacheManager } from "@google/generative-ai/server"
import { ClientOptions } from "openai"

export class GoogleProvider extends GoogleGenerativeAI implements OpenAILikeClient<"google"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"
  public cacheManager

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
    this.cacheManager = new GoogleAICacheManager(apiKey)
  }

  /**
   * Transforms the OpenAI chat completion parameters into Google chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Google chat completion parameters.
   */
  private transformParams(params: GoogleChatCompletionParams): GenerateContentRequest {
    let function_declarations: FunctionDeclarationsTool[] = []
    const allowedFunctionNames: string[] = []

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

    // cache data doesn't support tools or system messages (yet)
    if (params.additionalProperties?.["cacheName"]) {
      return {
        contents
      }
    }

    if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
      function_declarations = params.tools.map(tool => {
        allowedFunctionNames.push(tool.function.name)
        return {
          name: tool.function.name ?? "",
          description: tool.function.description ?? "",
          parameters: tool.function.parameters
        } as FunctionDeclarationsTool
      })
    }

    const systemMessages = params.messages.filter(message => message.role === "system")
    // the type of systemInstruction is string | Part | Content - but this structure seems to be the only one that works
    const systemInstruction =
      systemMessages.length > 0
        ? {
            parts: systemMessages.map(message => ({ text: message.content.toString() })),
            role: "system"
          }
        : undefined

    return {
      contents,
      ...(function_declarations?.length
        ? {
            tools: [{ function_declarations } as Tool],
            toolConfig: {
              functionCallingConfig: {
                mode: FunctionCallingMode.ANY,
                allowedFunctionNames
              }
            }
          }
        : {}),
      systemInstruction
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

  /**
   * Creates a chat completion using the Google AI API.
   * @param params - The chat completion parameters.
   * @returns A Promise that resolves to an ExtendedCompletionGoogle object or an asynchronous iterable of ExtendedCompletionChunkGoogle objects if streaming is enabled.
   */
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

      let generativeModel
      if (params.additionalProperties?.["cacheName"]) {
        // if there's a cacheName, get model using cached content
        // note: need pay-as-you-go account - caching not available on free tier
        const cache = await this.cacheManager.get(
          params.additionalProperties?.["cacheName"]?.toString()
        )

        generativeModel = this.getGenerativeModelFromCachedContent(cache)
      } else {
        // regular, non-cached model
        generativeModel = this.getGenerativeModel({ model: params?.model })
      }

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
        transformedResult.model = params.model

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

  /**
   * Add content to the Google AI cache manager
   * @param params - the same params as used in chat.completion.create plus ttlSeconds
   * @returns the cache manager create response (which includes the cache name to use later)
   */
  public async createCacheManager(params: GooggleCacheCreateParams) {
    const googleParams = this.transformParams(params)
    return await this.cacheManager.create({
      ttlSeconds: params.ttlSeconds,
      model: params.model,
      ...googleParams
    })
  }
}
