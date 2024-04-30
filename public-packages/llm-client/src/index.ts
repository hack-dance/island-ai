import { AnthropicProvider } from "@/providers/anthropic"
import { OpenAIProvider } from "@/providers/openai"
import { OpenAILikeClient, Providers } from "@/types"
import { ClientOptions } from "openai"

export class LLMClient<P extends Providers> {
  private providerInstance: OpenAILikeClient<P>

  constructor(
    opts: ClientOptions & {
      provider: P
    }
  ) {
    // TODO: Throw this in a factory

    // TODO: Parameter is not optional ?
    switch (opts?.provider) {
        case "openai":
            this.providerInstance = new OpenAIProvider(opts) as OpenAILikeClient<P>
            break
        case "anthropic":
            // TODO: Why is this asserted as unknown before the client type ?
            this.providerInstance = new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
            break
        case "azure":
            this.providerInstance = new AzureProvider(opts) as OpenAILikeClient<P>
        default:
            throw new Error("Unsupported LLM provider")
    }

    // if (opts?.provider === "openai") {
    //   this.providerInstance = new OpenAIProvider(opts) as OpenAILikeClient<P>
    // } else {
    //   this.providerInstance = new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
    // }

    // TODO: What is the point of this ?
    const proxyHandler: ProxyHandler<OpenAILikeClient<P>> = {
      get: (target, prop, receiver) => {
        if (prop in target) {
          return Reflect.get(target, prop, receiver)
        }
      }
    }

    this.providerInstance = new Proxy(this.providerInstance, proxyHandler) as OpenAILikeClient<P>
  }

  public getProviderInstance(): OpenAILikeClient<P> {
    return this.providerInstance
  }
}

export function createLLMClient<P extends Providers>(
  opts: ClientOptions & {
    provider: P
    logLevel?: string
  } = { provider: "openai" as P }
): OpenAILikeClient<P> {
  const client = new LLMClient<P>(opts)
  return client.getProviderInstance()
}
