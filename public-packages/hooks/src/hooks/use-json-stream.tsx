import { useRef, useState } from "react"
import type { StartStream, StartStreamArgs, StopStream, UseJsonStreamProps } from "@/types"
import z from "zod"
import ZodStream from "zod-stream"

import { useStream } from "./use-stream"

/**
 * `useJsonStream` is a custom React hook that extends the `useStream` hook to add JSON parsing functionality.
 * It uses the `SchemaStream` to parse the incoming stream into JSON.
 *
 * @param {UseJsonStreamProps} props - The props for the hook include optional callback
 * functions that will be invoked at different stages of the stream lifecycle, and a schema for the JSON data.
 *
 * @returns {
 * startStream: StartStream,
 * stopStream: StopStream,
 * data: Partial<z.infer<T>>,
 * loading: boolean
 * }
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
  data: Partial<z.infer<T>>
  loading: boolean
} {
  const streamClient = useRef(new ZodStream({}))
  const stubbedValue = streamClient.current.getSchemaStub({ schema, defaultData })

  const [json, setJson] = useState<Partial<z.infer<T>>>(stubbedValue)
  const [loading, setLoading] = useState(false)
  const { startStream: startStreamBase, stopStream: stopStreamBase } = useStream({
    onBeforeStart,
    onStop
  })

  /**
   * @function stopStream
   * Stops the stream by aborting the fetch request.
   *
   * @example
   * ```
   * stopStream();
   * ```
   */
  const stopStream = () => {
    setLoading(false)
    stopStreamBase()
  }

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

      setLoading(false)
      onEnd && onEnd(json)
    } catch (err: any) {
      setLoading(false)

      if (err?.name === "AbortError") {
        console.warn("useJsonStream: aborted", err)

        return null
      }

      stopStream()
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    startStream,
    stopStream,
    loading,
    data: json
  }
}
