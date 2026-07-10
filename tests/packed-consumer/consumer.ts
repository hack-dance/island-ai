import { Agent, run } from "@openai/agents"
import { Output, streamText } from "ai"
import { SchemaStream } from "schema-stream"
import { consumeJsonStream, type UseJsonStreamProps } from "stream-hooks"
import { z } from "zod"
import ZodStream, { withResponseModel, type ZodStreamChunk } from "zod-stream"

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

const directEmissions = []
for await (const partial of new SchemaStream(schema).iterate(chunkedJson())) {
  directEmissions.push(partial)
}

if (
  !directEmissions.some(partial => partial.title === "hel") ||
  directEmissions.at(-1)?.nested?.count !== "2"
) {
  throw new Error("schema-stream packed iterate mismatch")
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

// Compile-only: these functions prove that the packed tarball accepts the real SDK
// stream types without casts, ts-expect-error, readers, decoders, or JSON.parse.
async function openAiAgentsCompatibilityFixture() {
  const agent = new Agent({
    name: "Packed SchemaStream fixture",
    instructions: "Return structured data.",
    outputType: schema
  })
  const result = await run(agent, "Extract data.", { stream: true })

  for await (const partial of new SchemaStream(schema).iterate(result.toTextStream())) {
    partial.nested?.count
  }

  await result.completed
  const finalOutput: z.output<typeof schema> | undefined = result.finalOutput
  void finalOutput
}

async function aiSdkCompatibilityFixture() {
  const result = streamText({
    model: "openai/gpt-5.2",
    output: Output.object({ schema }),
    prompt: "Extract data."
  })

  for await (const partial of new SchemaStream(schema).iterate(result.textStream)) {
    partial.items?.at(-1)?.label
  }

  const finalOutput: z.output<typeof schema> = await result.output
  void finalOutput
}

void openAiAgentsCompatibilityFixture
void aiSdkCompatibilityFixture

console.log("packed consumer ESM, types, and runtime passed")
