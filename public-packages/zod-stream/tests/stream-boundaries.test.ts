import { readableStreamToAsyncGenerator } from "@/oai/stream"
import ZodStream from "@/structured-stream.client"
import { describe, expect, test } from "bun:test"
import { z } from "zod"

function splitBytes({
  value,
  splitAt
}: {
  value: unknown
  splitAt: number
}): ReadableStream<Uint8Array> {
  const encoded = new TextEncoder().encode(JSON.stringify(value))

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoded.slice(0, splitAt))
      controller.enqueue(encoded.slice(splitAt))
      controller.close()
    }
  })
}

async function collect<T>(stream: AsyncIterable<T>): Promise<T[]> {
  const values: T[] = []
  for await (const value of stream) values.push(value)
  return values
}

describe("JSON stream boundaries", () => {
  test("reassembles a large JSON value split at the browser buffer boundary", async () => {
    const expected = { path: "output.md", text: "x".repeat(70_000) }
    const values = await collect(
      readableStreamToAsyncGenerator<typeof expected>(splitBytes({ value: expected, splitAt: 65_536 }))
    )

    expect(values).toEqual([expected])
  })

  test("preserves a multi-byte character split across reads", async () => {
    const encodedPrefix = new TextEncoder().encode('{"text":"Hello ').length
    const value = { text: "Hello 🌍 world" }
    const values = await collect(
      readableStreamToAsyncGenerator<typeof value>(
        splitBytes({ value, splitAt: encodedPrefix + 2 })
      )
    )

    expect(values).toEqual([value])
  })

  test("rejects truncated JSON instead of silently dropping it", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"text":"unfinished'))
        controller.close()
      }
    })

    await expect(collect(readableStreamToAsyncGenerator(stream))).rejects.toBeInstanceOf(
      SyntaxError
    )
  })

  test(
    "streams large Zod output without nulling the active string",
    async () => {
      const schema = z.object({ path: z.string(), text: z.string() })
      const expected = { path: "output.md", text: "x".repeat(70_000) }
      const stream = await new ZodStream().create({
        response_model: { schema },
        completionPromise: async () => splitBytes({ value: expected, splitAt: 65_536 })
      })
      const values = await collect(stream)

      expect(values.at(-1)).toMatchObject({
        ...expected,
        _meta: { _isValid: true }
      })
    },
    15_000
  )
})
