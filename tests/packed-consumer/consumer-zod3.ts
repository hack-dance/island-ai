import { SchemaStream } from "schema-stream"
import { z } from "zod"

const schema = z.object({
  title: z.string(),
  nested: z.object({ count: z.number() }),
  items: z.array(z.object({ label: z.string() }))
})
const parser = new SchemaStream(schema)
const stub = parser.getSchemaStub(schema)

if (stub.title !== null || stub.nested?.count !== null || stub.items?.length !== 0) {
  throw new Error("schema-stream packed Zod 3 stub mismatch")
}

const input = new ReadableStream<Uint8Array>({
  start(controller) {
    const encoder = new TextEncoder()
    for (const character of '{"title":"hello","nested":{"count":2},"items":[]}') {
      controller.enqueue(encoder.encode(character))
    }
    controller.close()
  }
})
const emissions: unknown[] = []

for await (const partial of parser.iterate(input)) {
  emissions.push(partial)
}

if (!emissions.some(value => JSON.stringify(value).includes('"title":"hel"'))) {
  throw new Error("schema-stream packed Zod 3 progressive emission mismatch")
}

console.log("packed schema-stream Zod 3 types and runtime passed")
