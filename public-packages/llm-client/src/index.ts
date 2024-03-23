import { AnthropicProvider } from "@/providers/anthropic"
import { OpenAIProvider } from "@/providers/openai"
import { OpenAILikeClient, Providers } from "@/types"
import { ClientOptions } from "openai"

export class LLMClient<P extends Providers> {
  constructor(
    opts?: ClientOptions & {
      provider: P
    }
  ) {
    const provider = opts?.provider ?? "openai"

    let providerInstance: OpenAILikeClient<P>

    if (provider === "openai") {
      providerInstance = new OpenAIProvider(opts) as OpenAILikeClient<P>
    } else {
      providerInstance = new AnthropicProvider(opts) as unknown as OpenAILikeClient<P>
    }

    const proxyHandler: ProxyHandler<OpenAILikeClient<P>> = {
      get: (target, prop, receiver) => {
        if (typeof (target as any)[prop] === "function") {
          return (...args: unknown[]) => {
            return (target as any)[prop](...args)
          }
        }
        return Reflect.get(target, prop, receiver)
      }
    }

    return new Proxy(providerInstance, proxyHandler) as OpenAILikeClient<P>
  }
}
