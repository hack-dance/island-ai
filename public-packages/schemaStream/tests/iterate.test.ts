import { SchemaStream, type SchemaStreamChunk } from "@/index"
import { describe, expect, test } from "bun:test"
import * as z from "zod"

async function collect<TSchema extends z.ZodObject>(
  stream: AsyncIterable<SchemaStreamChunk<TSchema>>
): Promise<SchemaStreamChunk<TSchema>[]> {
  const values: SchemaStreamChunk<TSchema>[] = []
  for await (const value of stream) {
    values.push(value)
  }
  return values
}

describe("SchemaStream.iterate", () => {
  test("consumes string ReadableStreams with progressive nested emissions", async () => {
    const schema = z.object({
      title: z.string(),
      nested: z.object({ count: z.number() })
    })
    const chunks = ['{"title":"hel', 'lo","nested":{"count":', "2}}"]
    const source = new ReadableStream<string>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk)
        controller.close()
      }
    })

    const emissions = await collect(new SchemaStream(schema).iterate(source))

    expect(emissions).toHaveLength(chunks.length)
    expect(emissions[0]).toEqual({ title: "hel", nested: { count: null } })
    expect(emissions.at(-1)).toEqual({ title: "hello", nested: { count: 2 } })
  })

  test("consumes byte ReadableStreams split inside a UTF-8 code point", async () => {
    const schema = z.object({ message: z.string(), language: z.string() })
    const expected = { message: "hello 🌊", language: "日本語" }
    const encoded = new TextEncoder().encode(JSON.stringify(expected))
    const emoji = new TextEncoder().encode("🌊")
    const emojiStart = encoded.findIndex((_value, index) =>
      emoji.every((emojiByte, offset) => encoded[index + offset] === emojiByte)
    )
    const chunks = [
      encoded.slice(0, emojiStart + 1),
      encoded.slice(emojiStart + 1, emojiStart + 3),
      encoded.slice(emojiStart + 3)
    ]
    const source = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk)
        controller.close()
      }
    })

    const emissions = await collect(new SchemaStream(schema).iterate(source))

    expect(emissions).toHaveLength(chunks.length)
    expect(emissions.at(-1)).toEqual(expected)
  })

  test("consumes pure AsyncIterables and preserves completion paths", async () => {
    const schema = z.object({
      profile: z.object({ name: z.string() }),
      tags: z.array(z.string())
    })
    const completions: (string | number | undefined)[][] = []
    const source = {
      async *[Symbol.asyncIterator]() {
        yield '{"profile":{"name":"Ada"},"tags":["mat'
        yield 'h","science"]}'
      }
    }
    const parser = new SchemaStream(schema, {
      onKeyComplete({ activePath }) {
        completions.push(activePath)
      }
    })

    const emissions = await collect(parser.iterate(source))

    expect(emissions[0]).toEqual({ profile: { name: "Ada" }, tags: ["mat"] })
    expect(emissions.at(-1)).toEqual({ profile: { name: "Ada" }, tags: ["math", "science"] })
    expect(completions.some(path => path.join(".") === "profile.name")).toBe(true)
    expect(completions.some(path => path[0] === "tags" && path[1] === 1)).toBe(true)
    expect(completions.at(-1)).toEqual([])
  })

  test("propagates source errors and closes the source iterator", async () => {
    const schema = z.object({ value: z.string() })
    const sourceError = new Error("source failed")
    let returned = false
    const source: AsyncIterable<string> = {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            throw sourceError
          },
          async return() {
            returned = true
            return { done: true, value: undefined }
          }
        }
      }
    }

    await expect(new SchemaStream(schema).iterate(source).next()).rejects.toBe(sourceError)
    expect(returned).toBe(true)
  })

  test("propagates parser errors and closes the source iterator", async () => {
    const schema = z.object({ value: z.number() })
    let finalized = false
    const source = (async function* () {
      try {
        yield '{"value": nope}'
        yield '{"value": 1}'
      } finally {
        finalized = true
      }
    })()

    await expect(new SchemaStream(schema).iterate(source).next()).rejects.toBeInstanceOf(Error)
    expect(finalized).toBe(true)
  })

  test("cancels a ReadableStream when iteration ends early", async () => {
    const schema = z.object({ value: z.string() })
    let cancelled = false
    let pulled = false
    const source = new ReadableStream<string>({
      pull(controller) {
        if (!pulled) {
          pulled = true
          controller.enqueue('{"value":"in progress')
        }
      },
      cancel() {
        cancelled = true
      }
    })
    const iterator = new SchemaStream(schema).iterate(source)

    expect((await iterator.next()).value).toEqual({ value: "in progress" })
    await iterator.return()

    expect(cancelled).toBe(true)
  })

  test("does not pull the next source chunk until the consumer advances", async () => {
    const schema = z.object({ value: z.string() })
    let nextCalls = 0
    const chunks = ['{"value":"a', 'b"}']
    const source: AsyncIterable<string> = {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const index = nextCalls
            nextCalls += 1
            return index < chunks.length
              ? { done: false, value: chunks[index] }
              : { done: true, value: undefined }
          }
        }
      }
    }
    const iterator = new SchemaStream(schema).iterate(source)

    expect((await iterator.next()).value).toEqual({ value: "a" })
    expect(nextCalls).toBe(1)
    expect((await iterator.next()).value).toEqual({ value: "ab" })
    expect(nextCalls).toBe(2)
    await iterator.next()
    expect(nextCalls).toBe(3)
  })

  test("yields independent immutable-by-value snapshots", async () => {
    const schema = z.object({
      nested: z.object({ text: z.string() }),
      items: z.array(z.object({ name: z.string() }))
    })
    const source = (async function* () {
      yield '{"nested":{"text":"a'
      yield 'b"},"items":[{"name":"first"}]}'
    })()
    const iterator = new SchemaStream(schema).iterate(source)
    const first = (await iterator.next()).value

    expect(first).toBeDefined()
    if (!first) throw new Error("expected the first snapshot")
    first.nested!.text = "consumer mutation"
    first.items!.push({ name: "consumer item" })

    const second = (await iterator.next()).value

    expect(second).toEqual({ nested: { text: "ab" }, items: [{ name: "first" }] })
    expect(second?.nested).not.toBe(first.nested)
    expect(second?.items).not.toBe(first.items)
  })
})
