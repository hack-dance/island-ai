import type { z } from "zod"
import ZodStream, {
  type ZodStreamChunk,
  type ZodStreamDefaultData,
  type ZodStreamValue
} from "zod-stream"

export type ConsumeJsonStreamParams<T extends z.ZodObject> = {
  stream: ReadableStream<Uint8Array>
  schema: T
  onReceive?: (data: ZodStreamChunk<T>) => void
}

export type ConsumeJsonStreamResult<T extends z.ZodObject> = {
  data: z.output<T>
  lastChunk: ZodStreamChunk<T>
}

/** Consumes progressive schema-shaped chunks and validates the completed Zod 4 output. */
export async function consumeJsonStream<T extends z.ZodObject>({
  stream,
  schema,
  onReceive
}: ConsumeJsonStreamParams<T>): Promise<ConsumeJsonStreamResult<T>> {
  const client = new ZodStream()
  const extractionStream = await client.create({
    completionPromise: async () => stream,
    response_model: { schema }
  })
  let lastChunk: ZodStreamChunk<T> | undefined

  let next = await extractionStream.next()
  while (!next.done) {
    lastChunk = next.value
    onReceive?.(next.value)
    next = await extractionStream.next()
  }

  if (lastChunk === undefined) {
    throw new Error("JSON stream ended without a final value")
  }

  return { data: next.value, lastChunk }
}

export function createJsonStreamStub<T extends z.ZodObject>({
  schema,
  defaultData
}: {
  schema: T
  defaultData?: ZodStreamDefaultData<T>
}): ZodStreamValue<T> {
  return new ZodStream().getSchemaStub({ schema, defaultData })
}
