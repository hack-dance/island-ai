import { readableStreamToAsyncGenerator } from "@/oai/stream"
import { AIUICompletionParams, ClientConfig } from "@/types"
import { SchemaStream } from "schema-stream"
import { z } from "zod"

export default class AIUI {
  readonly debug: boolean = false

  constructor({ debug = false }: ClientConfig) {
    this.debug = debug
  }

  private log = (...args) => {
    if (this.debug) {
      console.log("AIUI DEBUG: ", ...args)
    }
  }

  private async chatCompletionStream<T extends z.AnyZodObject>({
    completionPromise,
    data,
    response_model
  }: AIUICompletionParams<T>): Promise<AsyncGenerator<Partial<z.infer<T>>, void, unknown>> {
    let _activePath: (string | number | undefined)[] = []
    let _completedPaths: (string | number | undefined)[][] = []

    const streamParser = new SchemaStream(response_model.schema, {
      typeDefaults: {
        string: null,
        number: null,
        boolean: null
      },
      onKeyComplete: ({ activePath, completedPaths }) => {
        _activePath = activePath
        _completedPaths = completedPaths
      }
    })

    try {
      const parser = streamParser.parse({
        handleUnescapedNewLines: true
      })

      const textEncoder = new TextEncoder()
      const textDecoder = new TextDecoder()

      const validationStream = new TransformStream({
        transform: async (chunk, controller): Promise<void> => {
          try {
            const parsedChunk = JSON.parse(textDecoder.decode(chunk))
            const validation = response_model.schema.safeParse(parsedChunk)

            controller.enqueue(
              textEncoder.encode(
                JSON.stringify({
                  ...parsedChunk,
                  _isValid: validation.success,
                  _activePath,
                  _completedPaths
                })
              )
            )
          } catch (e) {
            console.error(`Error in the partial stream validation stream`, e, chunk)
          }
        },
        flush() {
          this.activePath = undefined
        }
      })

      const stream = await completionPromise(data)

      if (!stream) {
        throw new Error("Completion call returned no data")
      }

      stream.pipeThrough(parser)
      parser.readable.pipeThrough(validationStream)

      return readableStreamToAsyncGenerator(validationStream.readable) as AsyncGenerator<
        Partial<z.infer<T>>,
        void,
        unknown
      >
    } catch (error) {
      console.error("Aiui: error making completion call")
      console.error(error)
      throw error
    }
  }

  public async create<P extends AIUICompletionParams<z.AnyZodObject>>(
    params: P
  ): Promise<AsyncGenerator<Partial<z.infer<P["response_model"]["schema"]>>, void, unknown>> {
    return this.chatCompletionStream(params)
  }
}
