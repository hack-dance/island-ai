import { LogLevel, ProviderClient } from "@/types"

export type ProviderCreationParams = ClientOptions & {
  apiKeyEnvVar: string,
  providerName: string,
  logLevel: LogLevel,
}

/**
 * Abstract base class that represents a wrapper around a LLM provider client.
 * Supports chat completions using the OpenAI interface by transforming both
 * input parameters and output responses to and from the associated LLM 
 * provider (eg. Anthropic, Azure, etc.), respectively
 */
export abstract class BaseProvider<P extends SupportedProvider> implements OpenAILikeClient<P> {
  private client: ProviderClient
  private name: string
  public logLevel: LogLevel

  constructor(p: ProviderCreationParams) {
    const apiKey = p.opts?.apiKey ?? process.env?.[p.apiKeyEnvVar] ?? null
    this.logLevel = p.opts?.logLevel ?? process.env?.["LOG_LEVEL" as LogLevel] ?? "info"

    if (!apiKey) {
      throw new Error(
        `API key is required for {p.providerName} \
- please provide it in the construct or set it as an \
environment variable named ${p.apiKeyEnvVar}`
      )
    }

    this.client = this.createClient()
  }

  /**
   * Creates an instance of this provider's official client
   * and authenticates it
   * @return {ProviderClient} The provider client
   */
  private abstract createClient(): ProviderClient

  /**
   * Transforms the given parameters (that follow OpenAI's Chat Completion API with
   * the exception of the models available. These will differ depending on provider)
   * into parameters appropriate for the particular model provider's chat 
   * completion API.
   * @param {ExtendedChatCompletionParams} params - The (extended) OpenAI chat 
   * completion parameters
   * @returns {ProviderChatCompletionParams} The transformed chat completion 
   * parameters that correspond to the particular model provider's chat
   * completion API
   */
  private abstract transformParamsRegular(
    params: ExtendedChatCompletionParams
  ): ProviderChatCompletionParams

  /**
   * Transforms the given parameters (that follow OpenAI's Chat Completion API with
   * the exception of the models available. These will differ depending on provider)
   * into parameters appropriate for the particular model provider's chat 
   * completion streaming API.
   * @param {ExtendedChatCompletionParams} params - The OpenAI API-like 
   * chat completion parameters
   * @returns {ProviderChatCompletionStreamingParams} The transformed chat 
   * completion parameters that correspond to the particular model provider's 
   * chat completion streaming API
   */
  private abstract transformParamsStream<E extends ExtendedChatCompletionParams>(
    params: E
  ): ProviderChatCompletionStreamingParams

  // TODO: Purpose statement + figure out types
  private abstract transformResponse(
    response: ProviderChatCompletion
  ): ExtendedChatCompletion

  // TODO: Purpose statement + figure out types
  private async abstract *transformResultingStream(
    responseStream: AsyncIterable<ProviderChatCompletionChunk>
  ): AsyncIterable<ExtendedChatCompletionChunk>

  // TODO: Purpose statement + figure out types
  private async abstract clientStreamChatCompletions(
    providerParams: ProviderChatCompletionStreamingParams
  ): AsyncIterable<ProviderChatCompletionChunk>

  // TODO: Purpose statement + figure out types
  private async abstract clientChatCompletions(
    providerParams: ProviderChatCompletionParams
  ): ProviderChatCompletion

  /**
   * Creates a chat completion using this provider's API by:
   * 1) Transforming the input to conform with this provider
   * 2) Calling the provider's chat completion API
   * 3) Transforming the output to conform with (an extended 
   * version of) OpenAI's API
   * @param {ExtendedChatCompletionParams} params - The (extended)
   * OpenAI chat completion parameters
   * @returns {Promise<ExtendedChatCompletion>} A Promise 
   * that resolves to an (extended) OpenAI chat completion
   */
  public async create(
    params: ExtendedChatCompletionParams
  ): Promise<ExtendedChatCompletion>

  public async create(
    params: ExtendedChatCompletionParams
  ): Promise<AsyncIterable<ExtendedChatCompletionChunk>>

  public async create(
    params: ExtendedChatCompletionParams
  ): Promise<ExtendedChatCompletion | AsyncIterable<ExtendedChatCompletionChunk>>{
    try {
      if (params.stream) {
        const providerParams = this.transformParamsStream(params)
        const messageStream = this.clientStreamChatCompletions(providerParams)

        return this.transformResultingStream(messageStream)
      } else {
        const providerParams = this.transformParamsRegular(params)
        const result = await this.clientChatCompletions(providerParams)
        const transformedResult = this.transformResponse(result)

        return transformedResult
      }
    } catch (error) {
      console.error(`Error in ${this.name} API request:`, error)
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }

  private log<T extends unknown[]>(level: LogLevel, ...args: T) {
    const timestamp = new Date().toISOString()
    const preamble = `[LLM-CLIENT--${this.name.toUpperCase()}-CLIENT:${level.toUpperCase()}]`
    const message = `${preamble} ${timestamp}:`

    switch (level) {
      case "debug":
        if (this.logLevel === "debug") {
          console.debug(message, ...args)
        }
        break
      case "info":
        if (this.logLevel === "debug" || this.logLevel === "info") {
          console.info(message, ...args)
        }
        break
      case "warn":
        if (this.logLevel === "debug" || this.logLevel === "info" || this.logLevel === "warn") {
          console.warn(message, ...args)
        }
        break
      case "error":
        console.error(message, ...args)
        break
    }
  }
}
