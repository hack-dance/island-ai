import { createAgent } from "@/create-agent"
import { describe, expect, test } from "bun:test"
import type OpenAI from "openai"
import { z } from "zod"

function completion(content: string): OpenAI.ChatCompletion {
  return {
    id: "completion_test",
    choices: [
      {
        finish_reason: "stop",
        index: 0,
        logprobs: null,
        message: { role: "assistant", content, refusal: null }
      }
    ],
    created: 0,
    model: "gpt-4o-mini",
    object: "chat.completion"
  }
}

function stream(parts: string[]): AsyncIterable<OpenAI.ChatCompletionChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const content of parts) {
        yield {
          id: "chunk_test",
          choices: [{ delta: { content }, finish_reason: null, index: 0 }],
          created: 0,
          model: "gpt-4o-mini",
          object: "chat.completion.chunk"
        }
      }
    }
  }
}

describe("createAgent", () => {
  test("uses OpenAI 6 structured output params and validates non-streaming output", async () => {
    const capturedParams: OpenAI.ChatCompletionCreateParams[] = []
    const client = {
      chat: {
        completions: {
          create: async (params: OpenAI.ChatCompletionCreateParams) => {
            capturedParams.push(params)
            return completion('{"name":"Ada","score":"2"}')
          }
        }
      }
    } as unknown as OpenAI
    const schema = z.object({
      name: z.string().transform(value => value.toUpperCase()),
      score: z.coerce.number()
    })
    const agent = createAgent({
      client,
      mode: "JSON_SCHEMA",
      response_model: { schema, name: "Agent_result" },
      defaultClientOptions: { model: "gpt-4o-mini", messages: [] }
    })

    await expect(
      agent.completion({ messages: [{ role: "user", content: "Extract" }] })
    ).resolves.toEqual({ name: "ADA", score: 2 })
    expect(capturedParams[0]?.response_format).toMatchObject({
      type: "json_schema",
      json_schema: { name: "Agent_result", strict: true }
    })
  })

  test("propagates final Zod validation failures", async () => {
    const client = {
      chat: {
        completions: {
          create: async () => completion('{"count":-1}')
        }
      }
    } as unknown as OpenAI
    const agent = createAgent({
      client,
      response_model: { schema: z.object({ count: z.number().positive() }), name: "Count" },
      defaultClientOptions: { model: "gpt-4o-mini", messages: [] }
    })

    await expect(agent.completion()).rejects.toBeInstanceOf(z.ZodError)
  })

  test("keeps Chat Completions streaming behavior with backpressure-aware bytes", async () => {
    const client = {
      chat: {
        completions: {
          create: async () => stream(['{"name":"', "Ada", '"}'])
        }
      }
    } as unknown as OpenAI
    const agent = createAgent({
      client,
      response_model: { schema: z.object({ name: z.string() }), name: "Name" },
      defaultClientOptions: { model: "gpt-4o-mini", messages: [] }
    })
    const responseStream = await agent.completionStream()
    const reader = responseStream.getReader()
    const decoder = new TextDecoder()
    let result = ""

    while (true) {
      const next = await reader.read()
      if (next.done) break
      result += decoder.decode(next.value)
    }

    expect(result).toBe('{"name":"Ada"}')
  })
})
