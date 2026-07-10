import { Agent, run } from "@openai/agents"
import { Output, streamText } from "ai"
import * as z from "zod"

import { SchemaStream, type SchemaStreamChunk } from "../src"

const schema = z.object({
  summary: z.string(),
  details: z.object({ score: z.number() }),
  tags: z.array(z.string())
})

/**
 * Compile-only fixture. It is never called and does not contact a model.
 * The packed-consumer fixture also covers a Zod 4 outputType in a clean install.
 */
export async function openAiAgentsTypeCompatibility(): Promise<void> {
  const agent = new Agent({
    name: "SchemaStream type fixture",
    model: "gpt-5.5",
    instructions: "Return the requested structured data as JSON."
  })
  const result = await run(agent, "Summarize this input.", { stream: true })
  const parser = new SchemaStream(schema)

  for await (const partial of parser.iterate(result.toTextStream())) {
    const typedPartial: SchemaStreamChunk<typeof schema> = partial
    void typedPartial.details?.score
  }

  await result.completed
  const finalOutput: string | undefined = result.finalOutput
  void finalOutput
}

/** Compile-only fixture. It is never called and does not contact a model. */
export async function aiSdkTypeCompatibility(): Promise<void> {
  const result = streamText({
    model: "openai/gpt-5.5",
    output: Output.object({ schema }),
    prompt: "Summarize this input."
  })
  const parser = new SchemaStream(schema)

  for await (const partial of parser.iterate(result.textStream)) {
    const typedPartial: SchemaStreamChunk<typeof schema> = partial
    void typedPartial.tags?.at(-1)
  }

  const finalOutput: z.output<typeof schema> = await result.output
  void finalOutput
}
