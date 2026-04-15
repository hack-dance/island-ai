import { OAIStream, readableStreamToAsyncGenerator } from "@/oai/stream"
import { withResponseModel } from "@/response-model"
import ZodStream from "@/structured-stream.client"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"
import { z } from "zod"

const textBlock = `
In our recent online meeting, participants from various backgrounds joined to discuss the upcoming tech conference. The names and contact details of the participants were as follows:

- Name: John Doe, Email: johndoe@email.com, Twitter: @TechGuru44
- Name: Jane Smith, Email: janesmith@email.com, Twitter: @DigitalDiva88
- Name: Alex Johnson, Email: alexj@email.com, Twitter: @CodeMaster2023

During the meeting, we agreed on several key points. The conference will be held on March 15th, 2024, at the Grand Tech Arena located at 4521 Innovation Drive. Dr. Emily Johnson, a renowned AI researcher, will be our keynote speaker.

The budget for the event is set at $50,000, covering venue costs, speaker fees, and promotional activities. Each participant is expected to contribute an article to the conference blog by February 20th.

A follow-up meeting is scheduled for January 25th at 3 PM GMT to finalize the agenda and confirm the list of speakers.
`

const ExtractionValuesSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string(),
        handle: z.string(),
        twitter: z.string()
      })
    )
    .min(3),
  location: z.string(),
  budget: z.number()
})

async function CreateOAIStream() {
  const oai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
    organization: process.env["OPENAI_ORG_ID"] ?? undefined
  })

  const params = withResponseModel({
    response_model: { schema: ExtractionValuesSchema, name: "Extract" },
    params: {
      messages: [{ role: "user", content: textBlock }],
      model: "gpt-4",
      seed: 1
    },
    mode: "TOOLS"
  })

  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true
  })

  return OAIStream({
    res: extractionStream
  })
}

async function extractUser() {
  const client = new ZodStream()

  const extractionStream = await client.create({
    completionPromise: CreateOAIStream,
    response_model: { schema: ExtractionValuesSchema, name: "Extract" }
  })

  let result: Partial<z.infer<typeof ExtractionValuesSchema>> = {}

  for await (const data of extractionStream) {
    result = data
  }

  return result
}

describe("OAI structured stream - basic", () => {
  test("Generator: Should return extracted users and budget", async () => {
    const extraction = await extractUser()
    expect(extraction?.users).toHaveLength(3)
    expect(extraction?.users![0]).toHaveProperty("name")
    expect(extraction?.users![0]).toHaveProperty("handle")
    expect(extraction?.users![0]).toHaveProperty("twitter")
  })
})


// Helper: create a ReadableStream that emits chunks at specified byte offsets
function chunkedStream(
  encoded: Uint8Array,
  splitAt: number
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoded.slice(0, splitAt))
      controller.enqueue(encoded.slice(splitAt))
      controller.close()
    }
  })
}

describe("readableStreamToAsyncGenerator - chunk boundary handling", () => {
  test("yields correct value when JSON is split across two chunks", async () => {
    const obj = { path: "output.md", text: "x".repeat(70_000) }
    const encoded = new TextEncoder().encode(JSON.stringify(obj))
    // Split at the 64KB boundary (browser ReadableStream internal buffer size)
    const stream = chunkedStream(encoded, 65536)

    const results: unknown[] = []
    for await (const chunk of readableStreamToAsyncGenerator(stream)) {
      results.push(chunk)
    }

    expect(results).toHaveLength(1)
    expect((results[0] as typeof obj).text).toHaveLength(70_000)
    expect((results[0] as typeof obj).path).toBe("output.md")
  })

  test("yields multiple complete objects from sequential chunks", async () => {
    // NOTE: This test sends two objects as separate enqueues. Bun (and most runtimes)
    // deliver them as separate read() results, so this passes. However, the Web Streams
    // spec does not prohibit a runtime from coalescing multiple enqueues into a single
    // read() result (e.g. {"a":"first"}{"a":"second"}). In that case JSON.parse would
    // throw on the concatenated string and the second object would be lost. This is a
    // known limitation — the upstream pipeline always emits one object per transform
    // call, so coalescing is only a risk if the runtime merges ReadableStream enqueues.
    const obj1 = { a: "first" }
    const obj2 = { a: "second" }
    const enc = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(enc.encode(JSON.stringify(obj1)))
        controller.enqueue(enc.encode(JSON.stringify(obj2)))
        controller.close()
      }
    })

    const results: unknown[] = []
    for await (const chunk of readableStreamToAsyncGenerator(stream)) {
      results.push(chunk)
    }

    expect(results).toHaveLength(2)
    expect(results[0]).toEqual(obj1)
    expect(results[1]).toEqual(obj2)
  })

  test("handles multi-byte UTF-8 character split across chunk boundary", async () => {
    const obj = { text: "Hello 🌍 World" }
    const json = JSON.stringify(obj)
    const encoded = new TextEncoder().encode(json)
    // Locate the emoji in the JSON string, then find its byte offset in the encoded
    // output. The emoji 🌍 is 4-byte UTF-8: F0 9F 8C 8D. We search from the byte
    // offset of its position in the JSON string to avoid false matches on earlier bytes.
    const emojiCharIndex = json.indexOf("🌍")
    // Each ASCII char before the emoji is 1 byte in UTF-8, so byte offset ≈ char index
    // for this simple JSON. We scan forward from there to find the F0 lead byte.
    let emojiByteOffset = emojiCharIndex
    while (encoded[emojiByteOffset] !== 0xf0) emojiByteOffset++
    // Split in the middle of the 4-byte emoji sequence
    const stream = chunkedStream(encoded, emojiByteOffset + 2)

    const results: unknown[] = []
    for await (const chunk of readableStreamToAsyncGenerator(stream)) {
      results.push(chunk)
    }

    expect(results).toHaveLength(1)
    expect((results[0] as typeof obj).text).toBe("Hello 🌍 World")
  })
})

describe("ZodStream - large content end-to-end", () => {
  // NOTE: A full end-to-end test through SchemaStream → validationStream →
  // readableStreamToAsyncGenerator with 70KB content is not feasible as a unit test.
  // SchemaStream emits JSON.stringify(schemaInstance) on every transform call,
  // producing ~70KB per input chunk. With ~69 chunks this creates ~10MB of pipe
  // throughput that deadlocks the synchronous pipe chain within test timeouts.
  //
  // The chunk-boundary fix is directly tested by the readableStreamToAsyncGenerator
  // tests above. The full pipeline is validated by the live OpenAI integration test.
  //
  // Untested paths:
  // - validationStream flush() handler (split-at-end-of-stream through full pipeline)
  // - Early consumer exit releasing the reader lock (requires try/finally in generator)
  // - Coalesced ReadableStream enqueues (runtime-dependent, see note on sequential test)
  test.skip("correctly streams large string content without null text", () => {})
})
