import { useCallback, useEffect, useRef } from "react"
import type { StartStreamArgs, StartStreamBase, StopStream, UseStreamProps } from "@/types"

/**
 * `useStream` is a custom React hook that creates a fetch request to a stream endpoint and manages the state of that stream
 * It provides functionalities to start and stop the stream, and manages the loading state.
 *
 * @param {UseStreamProps} props - The props for the hook include optional callback
 * functions that will be invoked at different stages of the stream lifecycle.
 *
 * @returns {
 *  startStream: StartStream,
 *  stopStream: StopStream
 * }
 *
 * @example
 * ```
 * const {
 *   loading,
 *   startStream,
 *   stopStream
 * } = useStream({ onBeforeStart: ..., onStop: ... });
 * ```
 */
export function useStream({ onBeforeStart, onStop }: UseStreamProps): {
  startStream: StartStreamBase
  stopStream: StopStream
} {
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * @function startStream
   * Starts a stream with the provided arguments.
   *
   * @param {StartStreamArgs} args - The arguments for starting the stream, including the URL and optional body.
   *
   * @returns {Promise<Response>} - A promise that resolves with the Response object from the fetch API.
   *
   * @example
   * ```
   * startStream({ url: 'http://example.com', body: { key: 'value' } });
   * ```
   */
  const startStream = async ({
    url,
    body = {},
    headers = {},
    method = "POST"
  }: StartStreamArgs): Promise<ReadableStream<Uint8Array>> => {
    try {
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      onBeforeStart && onBeforeStart()

      const response = await fetch(`${url}`, {
        method,
        headers,
        signal: abortController.signal,
        ...(method === "POST" ? { body: JSON.stringify(body) } : {})
      })

      if (!response.ok || !response?.body) {
        throw response
      }

      return response?.body
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.log("useStream: stream aborted", err)
        abortControllerRef.current = null

        throw err
      }

      console.error(`useStream: error`, err)
      throw err
    }
  }

  /**
   * @function stopStream
   * Stops the current stream.
   *
   * @example
   * ```
   * stopStream();
   * ```
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef?.current?.abort()
      abortControllerRef.current = null
    }
    onStop && onStop()
  }, [onStop])

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return {
    startStream,
    stopStream
  }
}
