import { createLLMClient } from "@/index"
import type { LLMClientOptions } from "@/types"
import { describe, expect, test } from "bun:test"
import type { ClientOptions } from "openai"

describe("LLMClient OpenAI Provider", () => {
  test("accepts the complete OpenAI 6 client options surface", () => {
    const sdkOptions = {
      apiKey: async () => "rotated-key",
      logLevel: "off"
    } satisfies ClientOptions

    const options = {
      provider: "openai",
      clientOptions: sdkOptions
    } satisfies LLMClientOptions<"openai">

    expect(options.clientOptions).toBe(sdkOptions)
  })

  test("forwards OpenAI 6 client options to requests", async () => {
    const requests: Request[] = []
    const fakeFetch: NonNullable<ClientOptions["fetch"]> = async (input, init) => {
      requests.push(new Request(input, init))

      return new Response(
        JSON.stringify({
          id: "chatcmpl_test",
          object: "chat.completion",
          created: 0,
          model: "test-model",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: { role: "assistant", content: "ok", refusal: null }
            }
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 }
        }),
        { headers: { "content-type": "application/json" } }
      )
    }

    const client = createLLMClient({
      provider: "openai",
      clientOptions: {
        apiKey: async () => "rotated-key",
        baseURL: "https://example.test/v1",
        defaultHeaders: { "x-contract-test": "forwarded" },
        defaultQuery: { trace: "contract" },
        fetch: fakeFetch,
        logLevel: "off",
        maxRetries: 0
      }
    })

    const response = await client.chat.completions.create({
      model: "test-model",
      messages: [{ role: "user", content: "hello" }]
    })

    expect(response.choices[0]?.message.content).toBe("ok")
    expect(requests).toHaveLength(1)
    expect(requests[0]?.url).toBe("https://example.test/v1/chat/completions?trace=contract")
    expect(requests[0]?.headers.get("authorization")).toBe("Bearer rotated-key")
    expect(requests[0]?.headers.get("x-contract-test")).toBe("forwarded")
  })
})
