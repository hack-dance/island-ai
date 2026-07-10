import { SchemaStream } from "schema-stream"
import ZodStream, { withResponseModel, type ZodStreamChunk } from "zod-stream"
import { consumeJsonStream, type UseJsonStreamProps } from "stream-hooks"
import { z } from "zod"

const schema = z.object({
  title: z.string().transform(value => value.toUpperCase()),
  nested: z.object({ count: z.coerce.number() }),
  items: z.array(z.object({ label: z.string() }))
})

function chunkedJson(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const value = { title: "hello", nested: { count: "2" }, items: [{ label: "first" }] }

  return new ReadableStream({
    start(controller) {
      for (const character of JSON.stringify(value)) {
        controller.enqueue(encoder.encode(character))
      }
      controller.close()
    }
  })
}

const directStub = new SchemaStream(schema).getSchemaStub(schema)
if (directStub.title !== null || directStub.items?.length !== 0) {
  throw new Error("schema-stream packed stub mismatch")
}

const chunks: ZodStreamChunk<typeof schema>[] = []
const stream = await new ZodStream().create({
  response_model: { schema },
  completionPromise: async () => chunkedJson()
})

for await (const chunk of stream) {
  chunks.push(chunk)
}

if (!chunks.some(chunk => chunk.title === "hel") || !chunks.at(-1)?._meta._isValid) {
  throw new Error("zod-stream packed progressive emission mismatch")
}

const consumed = await consumeJsonStream({ stream: chunkedJson(), schema })
if (consumed.data.title !== "HELLO" || consumed.data.nested.count !== 2) {
  throw new Error("stream-hooks packed final validation mismatch")
}

const params = withResponseModel({
  response_model: { schema, name: "Packed_consumer" },
  mode: "JSON_SCHEMA",
  params: { model: "gpt-4o-mini", messages: [{ role: "user", content: "extract" }] }
})
if (params.response_format.type !== "json_schema") {
  throw new Error("zod-stream packed JSON Schema mode mismatch")
}

const hookContract: UseJsonStreamProps<typeof schema> = {
  schema,
  onReceive(chunk) {
    chunk._meta._completedPaths
  },
  onEnd(output) {
    output.nested.count.toFixed()
  }
}
void hookContract

console.log("packed consumer ESM, types, and runtime passed")
