import { LogLevel } from '../../index.ts'

export type ProviderCreationParams = ClientOptions & {
  apiKeyEnvVar: string,
  providerName: string,
  logLevel: LogLevel,
}

/**
 * Abstract base class that provides interface for interacting with 
 * the API from for non-OpenAI LLM providers. Allows for concrete implementations
 * of client authentication and chat completion using the provider's API
 */
export abstract class BaseProvider<P extends Providers> implements OpenAILikeClient<P> {
  private client
  private name: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"

  constructor(p: ProviderCreationParams) {
    const apiKey = p.opts?.apiKey ?? process.env?.[p.apiKeyEnvVar] ?? null
    const logLevel = p.opts?.logLevel ?? process.env?.["LOG_LEVEL" as LogLevel] ?? "info"

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
   * TODO: Purpose statement + return type
   */
  private abstract createClient(): Q;

  // TODO: Figure out types

  /**
   * Transforms the given parameters (that follow OpenAI's Chat Completion API with
   * the exception of the models available. These will differ depending on provider)
   * into parameters appropriate for the particular model provider's API.
   * @param {type} params - The OpenAI chat completion parameters
   * @returns {type} The transformed chat completion parameters that correspond
   * to the particular model provider's API
   */
  private abstract transformParamsRegular(params: P): Q;

  // TODO: Purpose statement + figure out types
  private abstract transformParamsStream(params: P): Q;

  // TODO: Purpose statement + figure out types
  private abstract transformResponse(response: P): Q;

  public async create<P extends GenericChatCompletionParams>(
    params: P
  ): Q {
    try {
      if (params.stream) {
        const providerParams = this.transformParamsStream(params)
        // TODO: Streaming chat completion
      } else {
        const providerParams = this.transformParamsRegular(params)
        // TODO: Figure out how to abstract this across providers
        const result = await this.client.getChatCompletions(providerParams)
        const transformedResult = await = this.transformResponse(result)

        return transformedResult as Q
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
    switch (level) {
      const preamble = `[LLM-CLIENT--${this.name.toUpperCase()}-CLIENT:${level.toUpperCase()}]`
      const message = `${preamble} ${timestamp}:`
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
