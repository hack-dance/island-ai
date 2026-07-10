import { describe, expect, test } from "bun:test"
import type { ZodStreamChunk } from "zod-stream"
import { z } from "zod"

import { consumeJsonStream, createJsonStreamStub } from "@/lib/consume-json-stream"

function chunkedJson(value: unknown): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    start(controller) {
      for (const character of JSON.stringify(value)) {
        controller.enqueue(encoder.encode(character))
      }
      controller.close()
    }
  })
}

describe("consumeJsonStream", () => {
  test("emits progressive nested chunks and returns the validated Zod 4 output", async () => {
    const schema = z.object({
      title: z.string().transform(value => value.toUpperCase()),
      nested: z.object({ count: z.coerce.number() }),
      items: z.array(z.object({ label: z.string() }))
    })
    const emissions: ZodStreamChunk<typeof schema>[] = []
    const result = await consumeJsonStream({
      stream: chunkedJson({
        title: "hello",
        nested: { count: "2" },
        items: [{ label: "first" }]
      }),
      schema,
      onReceive: data => emissions.push(data)
    })

    expect(emissions.some(emission => emission.title === "hel")).toBe(true)
    expect(result.lastChunk).toMatchObject({
      title: "hello",
      nested: { count: "2" },
      items: [{ label: "first" }],
      _meta: { _isValid: true }
    })
    expect(result.lastChunk._meta._completedPaths).toContainEqual(["items", 0, "label"])
    expect(result.data).toEqual({
      title: "HELLO",
      nested: { count: 2 },
      items: [{ label: "first" }]
    })
  })

  test("rejects invalid completed data instead of invoking a successful end path", async () => {
    const schema = z.object({ count: z.number().positive() })

    await expect(
      consumeJsonStream({ stream: chunkedJson({ count: -2 }), schema })
    ).rejects.toBeInstanceOf(z.ZodError)
  })

  test("creates schema-derived stubs with nested defaults", () => {
    const schema = z.object({
      title: z.string().default("untitled"),
      nested: z.object({ enabled: z.boolean() }),
      items: z.array(z.string())
    })

    expect(
      createJsonStreamStub({ schema, defaultData: { nested: { enabled: true } } })
    ).toEqual({
      title: "untitled",
      nested: { enabled: true },
      items: []
    })
  })
})
