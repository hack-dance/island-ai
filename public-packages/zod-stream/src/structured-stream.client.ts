import { readableStreamToAsyncGenerator } from "@/oai/stream"
import {
  ActivePath,
  ClientConfig,
  CompletedPaths,
  CompletionMeta,
  LogLevel,
  ZodStreamCompletionParams
} from "@/types"
import { SchemaStream } from "schema-stream"
import { z } from "zod"

export default class ZodStream {
  readonly debug: boolean = false

  constructor({ debug = false }: ClientConfig = {}) {
    this.debug = debug
  }

  private log<T extends unknown[]>(level: LogLevel, ...args: T) {
    if (!this.debug && level === "debug") {
      return
    }

    const timestamp = new Date().toISOString()
    switch (level) {
      case "debug":
        console.debug(`[ZodStream-CLIENT:DEBUG] ${timestamp}:`, ...args)
        break
      case "info":
        console.info(`[ZodStream-CLIENT:INFO] ${timestamp}:`, ...args)
        break
      case "warn":
        console.warn(`[ZodStream-CLIENT:WARN] ${timestamp}:`, ...args)
        break
      case "error":
        console.error(`[ZodStream-CLIENT:ERROR] ${timestamp}:`, ...args)
        break
    }
  }

  private async chatCompletionStream<T extends z.AnyZodObject>({
    completionPromise,
    data,
    response_model
  }: ZodStreamCompletionParams<T>): Promise<
    AsyncGenerator<Partial<z.infer<T>> & { _meta: CompletionMeta }, void, unknown>
  > {
    let _activePath: ActivePath = []
    let _completedPaths: CompletedPaths = []

    this.log("debug", "Starting completion stream")

    const streamParser = new SchemaStream(response_model.schema, {
      typeDefaults: {
        string: null,
        number: null,
        boolean: null
      },
      onKeyComplete: ({ activePath, completedPaths }) => {
        this.log("debug", "Key complete", activePath, completedPaths)
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
            const validation = await response_model.schema.safeParseAsync(parsedChunk)

            this.log("debug", "Validation result", validation)

            controller.enqueue(
              textEncoder.encode(
                JSON.stringify({
                  ...parsedChunk,
                  _meta: {
                    _isValid: validation.success,
                    _activePath,
                    _completedPaths
                  }
                })
              )
            )
          } catch (e) {
            this.log("error", "Error in the partial stream validation stream", e, chunk)
            controller.error(e)
          }
        },
        flush() {}
      })

      const stream = await completionPromise(data)

      if (!stream) {
        this.log("error", "Completion call returned no data")
        throw new Error(stream)
      }

      stream.pipeThrough(parser)
      parser.readable.pipeThrough(validationStream)

      return readableStreamToAsyncGenerator(validationStream.readable) as AsyncGenerator<
        Partial<z.infer<T>> & { _meta: CompletionMeta },
        void,
        unknown
      >
    } catch (error) {
      this.log("error", "Error making completion call")
      throw error
    }
  }

  public getSchemaStub({
    schema,
    defaultData = {}
  }: {
    schema: z.AnyZodObject
    defaultData?: Partial<z.infer<typeof schema>>
  }): Partial<z.infer<typeof schema>> {
    const streamParser = new SchemaStream(schema, {
      defaultData,
      typeDefaults: {
        string: null,
        number: null,
        boolean: null
      }
    })

    return streamParser.getSchemaStub(schema, defaultData)
  }

  public async create<P extends ZodStreamCompletionParams<z.AnyZodObject>>(
    params: P
  ): Promise<
    AsyncGenerator<
      Partial<z.infer<P["response_model"]["schema"]>> & { _meta: CompletionMeta },
      void,
      unknown
    >
  > {
    return this.chatCompletionStream(params)
  }
}
