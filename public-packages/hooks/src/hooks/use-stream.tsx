import { useCallback, useEffect, useRef } from "react"
import type { StartStreamArgs, StartStreamBase, StopStream, UseStreamProps } from "@/types"

export class StreamRequestError extends Error {
  readonly status: number
  readonly statusText: string

  constructor(response: Response) {
    super(`Stream request failed with ${response.status} ${response.statusText}`.trim())
    this.name = "StreamRequestError"
    this.status = response.status
    this.statusText = response.statusText
  }
}

/** Starts and stops fetch-backed byte streams for the higher-level JSON hook. */
export function useStream({ onBeforeStart, onStop }: UseStreamProps = {}): {
  startStream: StartStreamBase
  stopStream: StopStream
} {
  const abortControllerRef = useRef<AbortController | null>(null)

  const startStream = useCallback(
    async ({
      url,
      body = {},
      headers = {},
      method = "POST"
    }: StartStreamArgs): Promise<ReadableStream<Uint8Array>> => {
      const abortController = new AbortController()
      abortControllerRef.current = abortController
      onBeforeStart?.()

      const requestHeaders =
        method === "POST" && !Object.keys(headers).some(key => key.toLowerCase() === "content-type")
          ? { "content-type": "application/json", ...headers }
          : headers
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        signal: abortController.signal,
        ...(method === "POST" ? { body: JSON.stringify(body) } : {})
      })

      if (!response.ok) {
        throw new StreamRequestError(response)
      }

      if (!response.body) {
        throw new Error("Stream response did not include a body")
      }

      return response.body
    },
    [onBeforeStart]
  )

  const stopStream = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    onStop?.()
  }, [onStop])

  useEffect(() => stopStream, [stopStream])

  return {
    startStream,
    stopStream
  }
}
