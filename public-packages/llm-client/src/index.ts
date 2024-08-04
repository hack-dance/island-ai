import { AnthropicProvider } from "@/providers/anthropic"
import { GoogleProvider } from "@/providers/google"
import { OpenAIProvider } from "@/providers/openai"
import { OpenAILikeClient, Providers } from "@/types"
import { TextDecoderStream, TextEncoderStream } from "@/utils/polyfills"
import { ClientOptions } from "openai"

// polyfills
globalThis.TextEncoderStream ||= TextEncoderStream
globalThis.TextDecoderStream ||= TextDecoderStream

export class LLMClient<P extends Providers> {
  private providerInstance: OpenAILikeClient<P>

  constructor(
    opts: ClientOptions & {
      provider: P
    }
  ) {
    switch (opts?.provider) {
      case "anthropic":
        this.providerInstance = new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
        break
      case "google":
        this.providerInstance = new GoogleProvider(opts) as unknown as OpenAILikeClient<P>
        break
      case "openai":
      default:
        this.providerInstance = new OpenAIProvider(opts) as OpenAILikeClient<P>
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

export function createLLMClient<P extends Providers>(
  opts: ClientOptions & {
    provider: P
    logLevel?: string
  } = { provider: "openai" as P }
): OpenAILikeClient<P> {
  const client = new LLMClient<P>(opts)
  return client.getProviderInstance()
}
