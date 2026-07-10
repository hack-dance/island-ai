import { useCallback, useMemo, useState } from "react"
import type { StartStreamArgs, UseJsonStreamProps, UseJsonStreamResult } from "@/types"
import type { z } from "zod"
import type { ZodStreamValue } from "zod-stream"

import { consumeJsonStream, createJsonStreamStub } from "@/lib/consume-json-stream"

import { useStream } from "./use-stream"

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "name" in error && error.name === "AbortError"
  )
}

/** Streams a fetch response into progressive Zod-shaped values and a validated final output. */
export function useJsonStream<T extends z.ZodObject>({
  onReceive,
  onEnd,
  schema,
  onBeforeStart,
  onStop,
  defaultData
}: UseJsonStreamProps<T>): UseJsonStreamResult<T> {
  const stubbedValue = useMemo(
    () => createJsonStreamStub({ schema, defaultData }),
    [defaultData, schema]
  )
  const [json, setJson] = useState<ZodStreamValue<T>>(stubbedValue)
  const [loading, setLoading] = useState(false)
  const { startStream: startStreamBase, stopStream: stopStreamBase } = useStream({
    onBeforeStart,
    onStop
  })

  const stopStream = useCallback(() => {
    setLoading(false)
    stopStreamBase()
  }, [stopStreamBase])

  const startStream = useCallback(
    async (streamProps: StartStreamArgs): Promise<void> => {
      setLoading(true)

      try {
        const stream = await startStreamBase(streamProps)
        const result = await consumeJsonStream({
          stream,
          schema,
          onReceive: chunk => {
            onReceive?.(chunk)
            setJson(chunk)
          }
        })

        onEnd?.(result.data)
      } catch (error: unknown) {
        if (isAbortError(error)) {
          return
        }

        throw error
      } finally {
        setLoading(false)
      }
    },
    [onEnd, onReceive, schema, startStreamBase]
  )

  return {
    startStream,
    stopStream,
    loading,
    data: json
  }
}
