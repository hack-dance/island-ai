import ZodStream from "@/structured-stream.client"
import { describe, expect, test } from "bun:test"
import { z } from "zod"

describe("schema-stream compatibility", () => {
  test("preserves progressive and final emissions through the Zod 4 client", async () => {
    const schema = z.object({
      title: z.string(),
      details: z.object({ count: z.number() }),
      items: z.array(z.object({ label: z.string() }))
    })
    const data = {
      title: "Hello",
      details: { count: 2 },
      items: [{ label: "first" }]
    }
    const encoder = new TextEncoder()
    const chunks = Array.from(JSON.stringify(data))
    const client = new ZodStream()
    const stream = await client.create({
      response_model: { schema },
      completionPromise: async () =>
        new ReadableStream<Uint8Array>({
          start(controller) {
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(chunk))
            }
            controller.close()
          }
        })
    })
    const emissions = []

    for await (const emission of stream) {
      emissions.push(emission)
    }

    expect(emissions.some(emission => emission.title === "Hel")).toBe(true)
    expect(emissions.at(-1)).toMatchObject(data)
    expect(emissions.at(-1)?._meta._isValid).toBe(true)
    expect(emissions.at(-1)?._meta._completedPaths).toContainEqual(["items", 0, "label"])
  })
})
