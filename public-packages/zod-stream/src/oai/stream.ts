import OpenAI from "openai"

import { OAIResponseParser } from "./parser"

interface OaiStreamArgs {
  res: AsyncIterable<OpenAI.ChatCompletionChunk>
}

function stripControlCharacters(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\x00-\x1F\x7F-\x9F]/g, "")
}

/**
 * `OaiStream` creates a ReadableStream that parses the SSE response from OAI
 * and returns a parsed string from the response.
 *
 * @param {OaiStreamArgs} args - The arguments for the function.
 * @returns {ReadableStream<string>} - The created ReadableStream.
 */
export function OAIStream({ res }: OaiStreamArgs): ReadableStream<Uint8Array> {
  let cancelGenerator: () => void
  const encoder = new TextEncoder()

  async function* generateStream(
    res: AsyncIterable<OpenAI.ChatCompletionChunk>
  ): AsyncGenerator<string> {
    let cancel = false
    cancelGenerator = () => {
      cancel = true
      return
    }

    for await (const part of res) {
      if (cancel) {
        break
      }

      if (!OAIResponseParser(part)) {
        continue
      }

      yield OAIResponseParser(part)
    }
  }

  const generator = generateStream(res)

  return new ReadableStream({
    async start(controller) {
      for await (const parsedData of generator) {
        controller.enqueue(encoder.encode(stripControlCharacters(parsedData)))
      }

      controller.close()
    },
    cancel() {
      if (cancelGenerator) {
        cancelGenerator()
      }
    }
  })
}

/**
 * `readableStreamToAsyncGenerator` converts a ReadableStream to an AsyncGenerator.
 *
 * @param {ReadableStream<Uint8Array>} stream - The ReadableStream to convert.
 * @returns {AsyncGenerator<unknown>} - The converted AsyncGenerator.
 */
export async function* readableStreamToAsyncGenerator(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<unknown> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    // stripping a second time to be safe.
    const decodedString = stripControlCharacters(decoder.decode(value))
    yield JSON.parse(decodedString)
  }

  return
}
