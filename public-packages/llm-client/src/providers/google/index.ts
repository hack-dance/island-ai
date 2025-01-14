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
  OpenAILikeClient
} from "@/types"
import {
  ChatSession,
  Content,
  DynamicRetrievalMode,
  EnhancedGenerateContentResponse,
  FunctionCallingMode,
  FunctionDeclaration,
  GenerationConfig,
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
  GroundingMetadata,
  SafetySetting,
  StartChatParams,
  Tool,
  ToolConfig
} from "@google/generative-ai"
import { CachedContentUpdateParams, GoogleAICacheManager } from "@google/generative-ai/server"
import { ClientOptions } from "openai"

interface ExtendedAdditionalProperties {
  cacheName?: string
  sessionId?: string
  safetySettings?: SafetySetting[]
  modelGenerationConfig?: GenerationConfig
}

interface ModelConfig {
  model: string
  safetySettings?: SafetySetting[]
  generationConfig?: GenerationConfig
  tools?: Tool[]
  systemInstruction?: string | Content | undefined
}
interface GroundingMetadataExtended extends GroundingMetadata {
  webSearchQueries: string[]
  groundingChunks?: Array<{
    web?: {
      uri: string
      title: string
    }
  }>
  searchEntryPoint?: {
    renderedContent: string
  }
  groundingSupports?: Array<{
    segment: {
      startIndex?: number
      endIndex?: number
      text: string
    }
    groundingChunkIndices: number[]
    confidenceScores: number[]
  }>
}

interface ExtendedChoice {
  index: number
  message: {
    role: string
    content: string
    tool_calls?: Array<{
      index: number
      id: string
      function: {
        name: string
        arguments: string
      }
      type: string
    }>
  }
  finish_reason: string | null
  logprobs?: null
  grounding_metadata?: {
    search_queries: string[]
    sources: Array<{
      url: string
      title: string
    }>
    search_suggestion_html: string | undefined
  }
}

export class GoogleProvider extends GoogleGenerativeAI implements OpenAILikeClient<"google"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"
  private googleCacheManager
  private logger: ProviderLogger
  private activeChatSessions: Map<string, ChatSession> = new Map()

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
    const { additionalProperties, _additionalProperties, ...rest } = schema

    this.logger.log(
      this.logLevel,
      `Removing unsupported 'additionalProperties' from schema - ${JSON.stringify(
        additionalProperties ?? {}
      )}`
    )

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
   * Creates a generation config from the provided parameters
   */
  private createGenerationConfig(params: GoogleChatCompletionParams): GenerationConfig {
    return {
      temperature: params.temperature ?? undefined,
      topP: params.top_p ?? undefined,
      topK: params.n ?? undefined,
      maxOutputTokens: params.max_tokens ?? undefined,
      stopSequences: params.stop
        ? Array.isArray(params.stop)
          ? params.stop
          : [params.stop]
        : undefined,
      candidateCount: params.n ?? undefined
    }
  }

  /**
   * Transforms messages into Google's chat history format
   */
  private transformHistory(messages: GoogleChatCompletionParams["messages"]): Content[] {
    return messages.map(message => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content.toString() }]
    }))
  }

  private getModelConfig(params: GoogleChatCompletionParams) {
    const additionalProps = params.additionalProperties as ExtendedAdditionalProperties | undefined

    const modelConfig: ModelConfig = {
      model: params?.model,
      safetySettings: additionalProps?.safetySettings,
      generationConfig: additionalProps?.modelGenerationConfig
    }

    if (params.groundingThreshold !== undefined) {
      modelConfig.tools = [
        {
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_DYNAMIC,
              dynamicThreshold: params.groundingThreshold
            }
          }
        }
      ]
    }

    if (params.systemInstruction) {
      modelConfig.systemInstruction = params.systemInstruction
    }

    return modelConfig
  }

  /**
   * Gets or creates a chat session
   */
  private async getChatSession(params: GoogleChatCompletionParams): Promise<ChatSession> {
    const additionalProps = params.additionalProperties as ExtendedAdditionalProperties | undefined
    const sessionId = additionalProps?.sessionId

    if (sessionId && this.activeChatSessions.has(sessionId)) {
      return this.activeChatSessions.get(sessionId)!
    }

    const generationConfig = this.createGenerationConfig(params)
    const history = this.transformHistory(params.messages)

    let generativeModel

    if (additionalProps?.cacheName) {
      const cache = await this.googleCacheManager.get(additionalProps.cacheName)
      generativeModel = this.getGenerativeModelFromCachedContent(cache)
    } else {
      generativeModel = this.getGenerativeModel(this.getModelConfig(params))
    }

    const chatParams: StartChatParams = {
      generationConfig,
      history
    }

    if (params.tools?.length) {
      const functionDeclarations = params.tools.map(tool => ({
        name: tool.function.name ?? "",
        description: tool.function.description ?? "",
        parameters: {
          type: "object",
          ...(tool.function.parameters ? this.cleanSchema(tool.function.parameters) : {})
        }
      })) as FunctionDeclaration[]

      const toolChoice = params.tool_choice as
        | { type: "function"; function: { name: string } }
        | undefined

      chatParams.tools = [
        {
          functionDeclarations
        }
      ] as Tool[]

      if (toolChoice?.type === "function") {
        chatParams.toolConfig = {
          functionCallingConfig: {
            mode: FunctionCallingMode.ANY,
            allowedFunctionNames: [toolChoice.function.name]
          }
        } satisfies ToolConfig
      }
    }

    const chatSession = generativeModel.startChat(chatParams)

    if (sessionId) {
      this.activeChatSessions.set(sessionId, chatSession)
    }

    return chatSession
  }

  /**
   * Transforms the Google API response into an ExtendedCompletionGoogle or ExtendedCompletionChunkGoogle object.
   */
  private transformResponse(
    responseDataChunk: EnhancedGenerateContentResponse,
    params: GoogleChatCompletionParams
  ): ExtendedCompletionGoogle | ExtendedCompletionChunkGoogle {
    const responseText = responseDataChunk.text()
    const toolCalls =
      responseDataChunk.candidates?.[0]?.content?.parts?.flatMap(part =>
        part.functionCall
          ? [
              {
                index: 0,
                id: `call_${Math.random().toString(36).slice(2)}`,
                function: {
                  name: part.functionCall.name,
                  arguments: JSON.stringify(part.functionCall.args)
                },
                type: "function"
              }
            ]
          : []
      ) ?? []

    const groundingMetadata = responseDataChunk.candidates?.[0]?.groundingMetadata as
      | GroundingMetadataExtended
      | undefined

    let contentWithGrounding = responseText
    let sources: Array<{ url: string; title: string }> = []

    if (groundingMetadata) {
      sources =
        groundingMetadata.groundingChunks?.map(chunk => ({
          url: chunk.web?.uri ?? "",
          title: chunk.web?.title ?? ""
        })) ?? []

      if (groundingMetadata.groundingSupports?.length) {
        contentWithGrounding += "\n\n**Grounded Segments**\n"
        groundingMetadata.groundingSupports.forEach(support => {
          const sourceIndices = support.groundingChunkIndices
          const sourceTitles = sourceIndices
            .map(index => sources[index]?.title)
            .filter(Boolean)
            .join(", ")
          const avgConfidence =
            support.confidenceScores.reduce((a, b) => a + b, 0) / support.confidenceScores.length
          contentWithGrounding += `> "${support.segment.text}"\n`
          contentWithGrounding += `> Sources: ${sourceTitles} (Confidence: ${(avgConfidence * 100).toFixed(1)}%)\n\n`
        })
      }

      if (sources.length > 0) {
        contentWithGrounding += "\n**Grounding Sources**\n"
        sources.forEach(source => {
          contentWithGrounding += `- [${source.title}](${source.url})\n`
        })
      }
    }

    const responseDataBase = {
      id: `chatcmpl-${Math.random().toString(36).slice(2)}`,
      object: params.stream ? "chat.completion.chunk" : "chat.completion",
      created: Date.now(),
      model: params.model,
      system_fingerprint: undefined,
      originResponse: responseDataChunk,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: toolCalls.length ? "" : contentWithGrounding,
            ...(toolCalls.length ? { tool_calls: toolCalls } : {})
          },
          ...(groundingMetadata
            ? {
                grounding_metadata: {
                  search_queries: groundingMetadata.webSearchQueries,
                  sources: sources,
                  search_suggestion_html: groundingMetadata.searchEntryPoint?.renderedContent,
                  supports: groundingMetadata.groundingSupports?.map(support => ({
                    text: support.segment.text,
                    sources: support.groundingChunkIndices.map(index => sources[index]),
                    confidence: support.confidenceScores
                  }))
                }
              }
            : {}),
          finish_reason: responseDataChunk.candidates?.[0]?.finishReason?.toLowerCase() ?? null,
          logprobs: null
        } as ExtendedChoice
      ]
    }

    if (params.stream) {
      return {
        ...responseDataBase,
        choices: [
          {
            ...responseDataBase.choices[0],
            delta: responseDataBase.choices[0].message
          }
        ]
      } as ExtendedCompletionChunkGoogle
    }

    return responseDataBase as ExtendedCompletionGoogle
  }

  /**
   * Streams the chat completion response from the Google API.
   */
  private async *streamChatCompletion(
    stream: AsyncIterable<EnhancedGenerateContentResponse>,
    params: GoogleChatCompletionParams
  ): AsyncIterable<ExtendedCompletionChunkGoogle> {
    for await (const chunk of stream) {
      yield this.transformResponse(chunk, params) as ExtendedCompletionChunkGoogle
    }
  }

  /**
   * Creates a chat completion using the Google AI API.
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

      const chatSession = await this.getChatSession(params)
      const lastMessage = params.messages[params.messages.length - 1]

      if (params?.stream) {
        this.logger.log(this.logLevel, "Starting streaming completion response")
        const result = await chatSession.sendMessageStream(lastMessage.content.toString())
        return this.streamChatCompletion(result.stream, params)
      } else {
        const result = await chatSession.sendMessage(lastMessage.content.toString())
        if (!result?.response) {
          throw new Error("Chat response failed")
        }

        const transformedResult = this.transformResponse(result.response, params)
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
   */
  public async createCacheManager(params: GoogleCacheCreateParams) {
    const contents = this.transformHistory(params.messages)

    try {
      return await this.googleCacheManager.create({
        ttlSeconds: params.ttlSeconds,
        model: params.model,
        contents
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
      const contents = this.transformHistory(params.messages)
      return await this.googleCacheManager.update(cacheName, {
        cachedContent: {
          contents
        }
      } as CachedContentUpdateParams)
    },
    delete: async (cacheName: string) => {
      return await this.googleCacheManager.delete(cacheName)
    }
  }
}
