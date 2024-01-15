import { useRef, useState } from "react"
import StructuredStreamClient from "@island-ai/core"
import z from "zod"

import { useStream, UseStreamProps } from "./use-stream"

interface StartStream {
  (args: StartStreamArgs): void
}

interface StopStream {
  (): void
}

export interface StartStreamArgs {
  url: string
  body?: object
  headers?: Record<string, string>
  method?: "GET" | "POST"
}

export interface UseJsonStreamProps<T extends z.ZodType<any, any>> extends UseStreamProps {
  onReceive?: (data: Partial<z.infer<T>>) => void
  onEnd?: (data: z.infer<T>) => void
  schema: T
  defaultData?: Partial<z.infer<T>>
}

/**
 * `useJsonStream` is a custom React hook that extends the `useStream` hook to add JSON parsing functionality.
 * It uses the `SchemaStream` to parse the incoming stream into JSON.
 *
 * @param {UseJsonStreamProps} props - The props for the hook include optional callback
 * functions that will be invoked at different stages of the stream lifecycle, and a schema for the JSON data.
 *
 * @returns {Object} - An object that includes the loading state, start and stop stream functions, and the parsed JSON data.
 *
 * @example
 * ```
 * const {
 *   loading,
 *   startStream,
 *   stopStream,
 * } = useJsonStream({ onBeforeStart: ..., onReceive: ..., onStop: ..., schema: ... });
 * ```
 */

export function useJsonStream<T extends z.AnyZodObject>({
  onReceive,
  onEnd,
  schema,
  onBeforeStart,
  onStop,
  defaultData = {}
}: UseJsonStreamProps<T>): {
  startStream: StartStream
  stopStream: StopStream
  loading: boolean
} {
  const streamClient = useRef(new StructuredStreamClient({}))
  const stubbedValue = streamClient.current.getSchemaStub({ schema, defaultData })

  const [json, setJson] = useState(stubbedValue)
  const [loading, setLoading] = useState(false)
  const { startStream: startStreamBase, stopStream } = useStream({
    onBeforeStart,
    onStop
  })

  /**
   * @function startStream
   * Starts a stream with the provided arguments and parses the incoming stream into JSON.
   *
   * @param {StartStreamArgs} args - The arguments for starting the stream, including the URL and optional body.
   *
   * @example
   * ```
   * startStream();
   * ```
   */
  const startStream = async (streamProps: StartStreamArgs) => {
    setLoading(true)

    try {
      const extractionStream = await streamClient.current.create({
        completionPromise: async () => await startStreamBase(streamProps),
        response_model: { schema }
      })

      for await (const data of extractionStream) {
        onReceive && onReceive(data)
        setJson(data)
      }

      onEnd && onEnd(json)
    } catch (err: any) {
      setLoading(false)

      if (err?.name === "AbortError") {
        console.warn("useJsonStream: aborted", err)

        return null
      }

      stopStream()
      throw err
    }
  }

  return {
    startStream,
    stopStream,
    loading
  }
}
