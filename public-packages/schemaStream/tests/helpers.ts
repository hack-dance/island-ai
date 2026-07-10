import {
  SchemaStream,
  type OnKeyCompleteCallbackParams,
  type SchemaStreamChunk,
  type SchemaStreamOptions,
  type SchemaStreamParseOptions,
  type ZodObjectSchema
} from "@/index"

export async function collectEmissions<TSchema extends ZodObjectSchema>({
  schema,
  chunks,
  options,
  parseOptions
}: {
  schema: TSchema
  chunks: string[]
  options?: SchemaStreamOptions<TSchema>
  parseOptions?: SchemaStreamParseOptions
}): Promise<{
  emissions: SchemaStreamChunk<TSchema>[]
  completions: OnKeyCompleteCallbackParams[]
}> {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const completions: OnKeyCompleteCallbackParams[] = []
  const parser = new SchemaStream(schema, {
    ...options,
    onKeyComplete: completion => {
      completions.push(completion)
      options?.onKeyComplete?.(completion)
    }
  })

  const input = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    }
  })
  const reader = input.pipeThrough(parser.parse(parseOptions)).getReader()
  const emissions: SchemaStreamChunk<TSchema>[] = []

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }

    emissions.push(JSON.parse(decoder.decode(value)) as SchemaStreamChunk<TSchema>)
  }

  return { emissions, completions }
}
