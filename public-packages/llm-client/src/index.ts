import { AnthropicProvider } from "@/providers/anthropic"
import { OpenAIProvider } from "@/providers/openai"
import { OpenAILikeClient, Providers } from "@/types"
import { ClientOptions } from "openai"

// TODO: Enum to avoid throwing strings around ?
export type LogLevel = "debug" | "info" | "warn" | "error"

export class LLMClient<P extends Providers> {
  private providerInstance: OpenAILikeClient<P>

  constructor(
    opts: ClientOptions & {
      provider: P
    }
  ) {
    this.providerInstance = constructProviderInstance(opts?.provider)
  }

  public getProviderInstance(): OpenAILikeClient<P> {
    return this.providerInstance
  }

  /**
   * Factory method for model provider (eg. Azure, OpenAI, Anthropic, etc.) client instance
   * @param {Providers} p - The name of the provider
   * @returns {OpenAILikeClient<P extends Providers>} The client associated with 
   * the model provider
   */
  private constructProviderInstance<P extends Providers>(provider: P): OpenAILikeClient<P> {
    switch (opts?.provider) {
      case "openai":
        return new OpenAIProvider(opts) as OpenAILikeClient<P>
      case "anthropic":
        // TODO: Why is this asserted as unknown before the client type ?
        return new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
      case "azure":
        return new AzureProvider(opts) as OpenAILikeClient<P>
      default:
        throw new Error("Unsupported LLM provider")
    }
  }
}

export function createLLMClient<P extends Providers>(
  opts: ClientOptions & {
    provider: P
    logLevel: LogLevel = "info"
  } = { provider: "openai" as P }
): OpenAILikeClient<P> {
  const client = new LLMClient<P>(opts)
  return client.getProviderInstance()
}
