import { AnthropicProvider } from "@/providers/anthropic"
import { AzureProvider } from "@/providers/azure"
import { OpenAIProvider } from "@/providers/openai"
import { OpenAILikeClient, Providers } from "@/types"
import { ClientOptions } from "openai"

export class LLMClient<P extends SupportedProvider> {
  private providerInstance: OpenAILikeClient<P>

  constructor(
    opts: LLMClientCreateParams
  ) {
    this.providerInstance = this.constructProviderInstance(opts)
  }

  public getProviderInstance(): OpenAILikeClient<P> {
    return this.providerInstance
  }

  private constructProviderInstance<P extends SupportedProvider>(
    opts: LLMClientCreateParams 
  ): OpenAILikeClient<P> {
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

export type LLMClientCreateParams<P extends SupportedProvider> = ClientOptions & {
  provider: P
  logLevel: LogLevel
  authOpts: AuthenticationOptions
}

export function createLLMClient<P extends SupportedProvider>(
  opts: LLMClientCreateParams
): OpenAILikeClient<P> {
  if (!opts?.provider) {
    opts.provider = "openai"
  }

  const client = new LLMClient<P>(opts)

  return client.getProviderInstance()
}
