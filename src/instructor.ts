import { OAIStream, readableStreamToAsyncGenerator } from "@/oai/stream"
import { InstructorChatCompletionParams, InstructorConfig } from "@/types"
import { SchemaStream } from "schema-stream"
import { z } from "zod"

export class AIUI {
  readonly debug: boolean = false

  constructor({ debug = false }: InstructorConfig) {
    this.debug = debug
  }

  private log = (...args) => {
    if (this.debug) {
      console.log("INSTRUCTOR DEBUG: ", ...args)
    }
  }

  private chatCompletionStream<T extends z.AnyZodObject>({
    completionPromise,
    params,
    response_model
  }: InstructorChatCompletionParams<T>): Promise<
    AsyncGenerator<Partial<z.infer<T>>, void, unknown>
  > {
    const makeCompletionCall = async () => {
      const resolvedParams = params

      try {
        this.log("making completion call with params: ", resolvedParams)

        const completion = await completionPromise(resolvedParams)

        if (!("choices" in completion)) {
          return OAIStream({ res: completion })
        }
      } catch (error) {
        throw error
      }
    }

    const getStream = async () => {
      try {
        const data = await makeCompletionCall()

        if (!data) {
          throw new Error("Completion call returned no data")
        }

        return this.partialStreamResponse({
          stream: data,
          schema: response_model.schema
        })
      } catch (error) {
        console.error("Instructor: error making completion call")
        throw error
      }
    }

    return getStream()
  }

  private async partialStreamResponse<T extends z.AnyZodObject>({
    stream,
    schema
  }: {
    stream: ReadableStream
    schema: T
  }): Promise<AsyncGenerator<Partial<T>, void, unknown>> {
    let _activePath: (string | number | undefined)[] = []
    let _completedPaths: (string | number | undefined)[][] = []

    const streamParser = new SchemaStream(schema, {
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

    const parser = streamParser.parse({})
    const textEncoder = new TextEncoder()
    const textDecoder = new TextDecoder()

    const validationStream = new TransformStream({
      transform: async (chunk, controller): Promise<void> => {
        try {
          const parsedChunk = JSON.parse(textDecoder.decode(chunk))
          const validation = schema.safeParse(parsedChunk)

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

    stream.pipeThrough(parser)
    parser.readable.pipeThrough(validationStream)

    return readableStreamToAsyncGenerator<z.infer<T>>(validationStream.readable)
  }

  public getSchemaStub({ schema, defaultData = {} }) {
    const streamParser = new SchemaStream(schema, {
      typeDefaults: {
        string: null,
        number: null,
        boolean: null
      }
    })

    return streamParser.getSchemaStub(schema, defaultData)
  }

  public async create<T extends z.AnyZodObject, P extends InstructorChatCompletionParams<T>>(
    params: P
  ): Promise<AsyncGenerator<Partial<z.infer<T>>, void, unknown>> {
    return this.chatCompletionStream(params)
  }
}
