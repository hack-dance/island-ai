import ProviderLogger from "@/logger"
import { consoleTransport } from "@/logger/transports/console"
import {
  ExtendedCompletionChunkGoogle,
  ExtendedCompletionGoogle,
  GoogleCacheCreateParams,
  GoogleChatCompletionParams,
  GoogleChatCompletionParamsNonStream,
  GoogleChatCompletionParamsStream,
  LogLevel,
  OpenAILikeClient,
  Role
} from "@/types"
import {
  Content,
  DynamicRetrievalMode,
  EnhancedGenerateContentResponse,
  FunctionCallingMode,
  FunctionDeclarationsTool,
  GenerateContentRequest,
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
  TextPart,
  Tool
} from "@google/generative-ai"
import { CachedContentUpdateParams, GoogleAICacheManager } from "@google/generative-ai/server"
import { ClientOptions } from "openai"
import { isEmpty } from "ramda"

export class GoogleProvider extends GoogleGenerativeAI implements OpenAILikeClient<"google"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"
  private googleCacheManager
  private logger: ProviderLogger

  constructor(
    opts?: ClientOptions & {
      logLevel?: LogLevel
      groundingThreshold?: number
    }
  ) {
    const apiKey = opts?.apiKey ?? process.env?.["GEMINI_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for GeminiProvider - please provide it in the constructor or set it as an environment variable named GEMINI_API_KEY."
      )
    }

    super(apiKey)

    this.logLevel = opts?.logLevel ?? this.logLevel
    this.apiKey = apiKey
    this.googleCacheManager = new GoogleAICacheManager(apiKey)
    this.logger = new ProviderLogger("GEMINI-CLIENT")
    this.logger.addTransport(consoleTransport)
  }

  private cleanSchema(schema: Record<string, unknown>): Record<string, unknown> {
    const { _additionalProperties, ...rest } = schema

    if (rest["properties"] && typeof rest["properties"] === "object") {
      rest["properties"] = Object.entries(rest["properties"]).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === "object" && value !== null ? this.cleanSchema(value) : value
          return acc
        },
        {} as Record<string, unknown>
      )
    }

    if (rest["items"] && typeof rest["items"] === "object" && rest["items"] !== null) {
      rest["items"] = this.cleanSchema(rest["items"] as Record<string, unknown>)
    }

    return rest
  }

  /**
   * Transforms the OpenAI chat completion parameters into Google chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Google chat completion parameters.
   */
  private transformParams(params: GoogleChatCompletionParams): GenerateContentRequest {
    let function_declarations: FunctionDeclarationsTool[] = []
    const allowedFunctionNames: string[] = []
    const mappedTools: Tool[] = []

    const { systemMessages, nonSystemMessages } = params.messages.reduce<{
      systemMessages: typeof params.messages
      nonSystemMessages: typeof params.messages
    }>(
      (acc, message) => {
        if (message.role === "system") {
          acc.systemMessages.push(message)
        } else {
          acc.nonSystemMessages.push(message)
        }
        return acc
      },
      { systemMessages: [], nonSystemMessages: [] }
    )

    // conform messages to Google's Content[] type
    // they use "model" and "user" instead of "assistant" and "user", and also have no "system" role
    const contents: Content[] = nonSystemMessages.map(message => {
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

    const hasTools = !isEmpty(params?.tools)
    if (hasTools) {
      const tools = params.tools ?? []

      function_declarations = tools.map(tool => {
        allowedFunctionNames.push(tool.function.name)

        const parameters = tool.function.parameters
          ? this.cleanSchema(tool.function.parameters)
          : undefined

        return {
          name: tool.function.name ?? "",
          description: tool.function.description ?? "",
          parameters
        } as FunctionDeclarationsTool
      })

      mappedTools.push({ function_declarations } as Tool)
    }

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
            tools: mappedTools,
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

      const isGroundingEnabled = params?.groundingThreshold !== undefined

      if (isGroundingEnabled) {
        googleParams.tools?.push({
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_DYNAMIC,
              dynamicThreshold: params.groundingThreshold
            }
          }
        })
      }

      let generativeModel
      if (params.additionalProperties?.["cacheName"]) {
        // if there's a cacheName, get model using cached content
        // note: need pay-as-you-go account - caching not available on free tier
        const cache = await this.googleCacheManager.get(
          params.additionalProperties?.["cacheName"]?.toString()
        )

        generativeModel = this.getGenerativeModelFromCachedContent(cache)
      } else {
        // regular, non-cached model
        generativeModel = this.getGenerativeModel({
          model: params?.model
        })
      }

      if (params?.stream) {
        this.logger.log(this.logLevel, "Starting streaming completion response")

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
      this.logger.log(this.logLevel, new Error("Error in Google API request:", { cause: error }))
      throw error
    }
  }

  /**
   * Add content to the Google AI cache manager
   * @param params - the same params as used in chat.completion.create plus ttlSeconds
   * @returns the cache manager create response (which includes the cache name to use later)
   */
  public async createCacheManager(params: GoogleCacheCreateParams) {
    const googleParams = this.transformParams(params)

    try {
      return await this.googleCacheManager.create({
        ttlSeconds: params.ttlSeconds,
        model: params.model,
        ...googleParams
      })
    } catch (err: unknown) {
      let error = err as Error

      if (err instanceof GoogleGenerativeAIError) {
        error = new Error(
          "Failed to create Gemini cache manager, ensure your API key supports caching (i.e. pay-as-you-go)"
        )
        error.stack = (err as Error).stack
      }

      this.logger.log(this.logLevel, error)

      throw err
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }

  /** Interface for Google AI Cache Manager */
  public cacheManager = {
    create: this.createCacheManager.bind(this),
    get: async (cacheName: string) => {
      return await this.googleCacheManager.get(cacheName)
    },
    list: async () => {
      return await this.googleCacheManager.list()
    },
    update: async (cacheName: string, params: GoogleCacheCreateParams) => {
      const googleParams = this.transformParams(params)
      return await this.googleCacheManager.update(
        cacheName,
        googleParams as CachedContentUpdateParams
      )
    },
    delete: async (cacheName: string) => {
      return await this.googleCacheManager.delete(cacheName)
    }
  }
}
