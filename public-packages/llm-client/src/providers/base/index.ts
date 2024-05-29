import { 
  LogLevel, 
  ProviderClient, 
  AuthenticationOptions,
  LLMClientCreateParams
} from "@/types"

/**
 * Abstract base class that represents a wrapper around a LLM provider client.
 * Supports chat completions using the OpenAI interface by transforming both
 * input parameters and output responses to and from the associated LLM 
 * provider (eg. Anthropic, Azure, etc.), respectively
 */
export abstract class BaseProvider<P extends SupportedProvider> implements OpenAILikeClient<P> {
  private client: ProviderClient
  public name: string
  public logLevel: LogLevel

  constructor(p: LLMClientCreateParams) {
    this.logLevel = p.opts?.logLevel ?? process.env?.["LOG_LEVEL" as LogLevel] ?? "info"
    this.client = this.createClient()
    this.name = p.provider
  }

  /**
   * Creates an instance of this provider's official client
   * and authenticates it
   * @param {AuthenticationOptions} authOpts: An object with 
   * the necessary data for client authentication (eg. API key, 
   * token credential, etc.)
   * @return {ProviderClient} The provider client
   */
  private abstract createClient(
    authOpts: AuthenticationOptions
  ): ProviderClient

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
  private abstract transformParamsStream(
    params: ExtendedChatCompletionParams
  ): ProviderChatCompletionStreamingParams

  // TODO: Why is this asynchronous ?

  /**
   * Transforms the chat completion response from this provider's API
   * to one that extends the OpenAI Chat Completion API's response.
   * @param {ProviderChatCompletion} response - The provider's response
   * @returns {ExtendedChatCompletion | ExtendedChatCompletionChunk} 
   * The response transformed to extend OpenAI's Chat Completion API
   * response
   */
  private async abstract transformResponse(
    response: ProviderChatCompletion
  ): ExtendedChatCompletion | ExtendedChatCompletionChunk

  /**
   * Transforms the stream resulting from the streaming
   * version of this provider's chat completion API response
   * to a stream of extended OpenAI Chat Completion API responses.
   * @param {AsyncIterable<ProviderChatCompletionChunk>} responseStream -
   * The stream resulting from the provider's chat completion streaming
   * API
   * @returns {AsyncIterable<ExtendedChatCompletionChunk>} A stream
   * of chunks that extend OpenAI's ChatCompletionChunk
   */
  private async abstract *transformResultingStream(
    responseStream: AsyncIterable<ProviderChatCompletionChunk>
  ): AsyncIterable<ExtendedChatCompletionChunk>

  /**
   * A wrapper around the call to this provider's client's 
   * streaming chat completion API
   * @param {ProviderChatCompletionStreamingParams} providerParams
   * @returns {AsyncIterable<ProviderChatCompletionChunk>} Assumes that
   * every provider returns an AsyncIterable of chunks 
   */
  private async abstract clientStreamChatCompletions(
    providerParams: ProviderChatCompletionStreamingParams
  ): AsyncIterable<ProviderChatCompletionChunk>

  /**
   * A wrapper around the call to this provider's client's 
   * chat completion API
   * @param {ProviderChatCompletionParams} providerParams
   * @returns {ProviderChatCompletion} A Promise that
   * resolves to a chat completion
   */
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
        const messageStream = await this.clientStreamChatCompletions(providerParams)
        this.log("debug", "Starting streaming completion response")

        return this.transformResultingStream(messageStream)
      } else {
        const providerParams = this.transformParamsRegular(params)
        const result = await this.clientChatCompletions(providerParams)
        const transformedResult = await this.transformResponse(result)

        return transformedResult as ExtendedChatCompletion
      }
    } catch (error) {
      console.error(`Error in ${this.name} API request:`, error)
      throw error
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
