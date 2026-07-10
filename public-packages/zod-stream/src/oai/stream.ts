import type OpenAI from "openai"

import { OAIResponseParser } from "./parser"

interface OaiStreamArgs {
  res: AsyncIterable<OpenAI.ChatCompletionChunk>
}

/** Converts OpenAI Chat Completion deltas into a backpressure-aware byte stream. */
export function OAIStream({ res }: OaiStreamArgs): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const iterator = res[Symbol.asyncIterator]()

  return new ReadableStream<Uint8Array>({
    async pull(controller): Promise<void> {
      try {
        let next = await iterator.next()
        while (!next.done) {
          const parsedData = OAIResponseParser(next.value)
          if (parsedData) {
            controller.enqueue(encoder.encode(parsedData))
            return
          }

          next = await iterator.next()
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
    async cancel(): Promise<void> {
      await iterator.return?.()
    }
  })
}

/** Converts a byte stream of sequential JSON values into an async generator. */
export async function* readableStreamToAsyncGenerator<T = unknown>(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<T, void, unknown> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })

      try {
        yield JSON.parse(buffer) as T
        buffer = ""
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error
        }
      }
    }

    buffer += decoder.decode()
    if (buffer.trim().length > 0) {
      yield JSON.parse(buffer) as T
    }
  } finally {
    reader.releaseLock()
  }
}
