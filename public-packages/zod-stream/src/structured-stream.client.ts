import { SchemaStream, type SchemaStreamChunk } from "schema-stream"
import { z } from "zod"

import type {
  ActivePath,
  ClientConfig,
  CompletedPaths,
  CompletionMeta,
  LogLevel,
  ZodStreamChunk,
  ZodStreamCompletionParams,
  ZodStreamDefaultData
} from "@/types"

export default class ZodStream {
  readonly debug: boolean = false

  constructor({ debug = false }: ClientConfig = {}) {
    this.debug = debug
  }

  private log<T extends unknown[]>(level: LogLevel, ...args: T): void {
    if (!this.debug) {
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

  private async *chatCompletionStream<T extends z.ZodObject>({
    completionPromise,
    data,
    response_model
  }: ZodStreamCompletionParams<T>): AsyncGenerator<ZodStreamChunk<T>, z.output<T>, unknown> {
    let activePath: ActivePath = []
    let completedPaths: CompletedPaths = []
    let finalChunk: SchemaStreamChunk<T> | undefined

    this.log("debug", "Starting completion stream")

    const streamParser = new SchemaStream(response_model.schema, {
      typeDefaults: {
        string: null,
        number: null,
        boolean: null
      },
      onKeyComplete: completion => {
        this.log("debug", "Key complete", completion.activePath, completion.completedPaths)
        activePath = [...completion.activePath]
        completedPaths = completion.completedPaths.map(path => [...path])
      }
    })

    const source = await completionPromise(data)

    if (!source) {
      throw new Error("Completion call returned no stream")
    }

    try {
      for await (const parsedChunk of streamParser.iterate(source, {
        handleUnescapedNewLines: true
      })) {
        finalChunk = parsedChunk
        const validation = await response_model.schema.safeParseAsync(parsedChunk)

        this.log("debug", "Validation result", validation)

        const meta: CompletionMeta = {
          _isValid: validation.success,
          _activePath: [...activePath],
          _completedPaths: completedPaths.map(path => [...path])
        }

        yield { ...parsedChunk, _meta: meta } as ZodStreamChunk<T>
      }

      if (finalChunk === undefined) {
        throw new Error("Completion stream ended without emitting JSON")
      }

      return await response_model.schema.parseAsync(finalChunk)
    } catch (error) {
      this.log("error", "Error consuming completion stream", error)
      throw error
    }
  }

  public getSchemaStub<T extends z.ZodObject>({
    schema,
    defaultData = {}
  }: {
    schema: T
    defaultData?: ZodStreamDefaultData<T>
  }): SchemaStreamChunk<T> {
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

  public async create<T extends z.ZodObject>(
    params: ZodStreamCompletionParams<T>
  ): Promise<AsyncGenerator<ZodStreamChunk<T>, z.output<T>, unknown>> {
    return this.chatCompletionStream(params)
  }
}
