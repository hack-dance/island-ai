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
        if (prop in target) {
          return Reflect.get(target, prop, receiver)
        }
      }
    }

    return new Proxy(providerInstance, proxyHandler) as OpenAILikeClient<P>
  }
}

export function createLLMClient<P extends Providers>(
  opts?: ClientOptions & { provider: P }
): OpenAILikeClient<P> {
  const client = new LLMClient<P>(opts)

  return client as OpenAILikeClient<P>
}
