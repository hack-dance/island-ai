import { AnthropicProvider } from "@/providers/anthropic"
import { GoogleProvider } from "@/providers/google"
import { OpenAIProvider } from "@/providers/openai"
import type {
  LLMClientOptions,
  OpenAILikeClient,
  OpenAILLMClientOptions,
  Providers
} from "@/types"

export class LLMClient<P extends Providers> {
  private providerInstance: OpenAILikeClient<P>

  constructor(opts: LLMClientOptions<P>) {
    switch (opts.provider) {
      case "anthropic":
        this.providerInstance = new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
        break
      case "google":
        this.providerInstance = new GoogleProvider(opts) as unknown as OpenAILikeClient<P>
        break
      case "openai":
      default:
        const { provider: _provider, clientOptions, ...legacyOptions } =
          opts as OpenAILLMClientOptions
        this.providerInstance = new OpenAIProvider({
          ...legacyOptions,
          ...clientOptions
        }) as OpenAILikeClient<P>
    }

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

export function createLLMClient(): OpenAILikeClient<"openai">
export function createLLMClient<P extends Providers>(
  opts: LLMClientOptions<P>
): OpenAILikeClient<P>
export function createLLMClient<P extends Providers>(
  opts?: LLMClientOptions<P>
): OpenAILikeClient<P> | OpenAILikeClient<"openai"> {
  if (!opts) {
    return new LLMClient({ provider: "openai" }).getProviderInstance()
  }

  const client = new LLMClient<P>(opts)
  return client.getProviderInstance()
}
