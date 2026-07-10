import ZodStream from "@/structured-stream.client"
import { describe, expect, test } from "bun:test"
import { z } from "zod"

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

describe("ZodStream final validation", () => {
  test("keeps raw progressive input while validating schemas with transforms", async () => {
    const schema = z.object({
      title: z.string().transform(value => value.toUpperCase()),
      nested: z.object({ count: z.coerce.number() })
    })
    const stream = await new ZodStream().create({
      response_model: { schema },
      completionPromise: async () => chunkedJson({ title: "hello", nested: { count: "2" } })
    })
    const emissions = []

    for await (const emission of stream) {
      emissions.push(emission)
    }

    expect(emissions.some(emission => emission.title === "hel")).toBe(true)
    expect(emissions.at(-1)).toMatchObject({
      title: "hello",
      nested: { count: "2" },
      _meta: { _isValid: true }
    })
    expect(await schema.parseAsync(emissions.at(-1))).toEqual({
      title: "HELLO",
      nested: { count: 2 }
    })
  })

  test("rejects after an invalid final emission", async () => {
    const schema = z.object({ count: z.number().int().positive() })
    const stream = await new ZodStream().create({
      response_model: { schema },
      completionPromise: async () => chunkedJson({ count: -1 })
    })

    const consume = async () => {
      for await (const _emission of stream) {
        // Consume the full stream so final validation runs.
      }
    }

    await expect(consume()).rejects.toBeInstanceOf(z.ZodError)
  })

  test("propagates source stream failures", async () => {
    const sourceError = new Error("upstream failed")
    const stream = await new ZodStream().create({
      response_model: { schema: z.object({ value: z.string() }) },
      completionPromise: async () =>
        new ReadableStream({
          start(controller) {
            controller.error(sourceError)
          }
        })
    })

    const consume = async () => {
      for await (const _emission of stream) {
        // Consume until the upstream error is observed.
      }
    }

    await expect(consume()).rejects.toBe(sourceError)
  })
})
