

export type LogLevel = "debug" | "info" | "warn" | "error"
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

    this.authenticateClient()
  }

  /**
   * TODO: Purpose statement. Don't forget to mention that the API key must
   * be set before this is called
   */
  private abstract authenticateClient();

  // public async create(
  //   params: 
  // )

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
