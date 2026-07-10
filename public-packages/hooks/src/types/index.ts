import type { z } from "zod"
import type { ZodStreamChunk, ZodStreamDefaultData, ZodStreamValue } from "zod-stream"

export interface StartStream {
  (args: StartStreamArgs): Promise<void>
}

export interface StartStreamBase {
  (args: StartStreamArgs): Promise<ReadableStream<Uint8Array>>
}

export interface StopStream {
  (): void
}

export interface StartStreamArgs {
  url: string
  body?: object
  headers?: Record<string, string>
  method?: "GET" | "POST"
}

export interface UseStreamProps {
  onBeforeStart?: () => void
  onStop?: () => void
}

export interface UseJsonStreamProps<T extends z.ZodObject> extends UseStreamProps {
  onReceive?: (data: ZodStreamChunk<T>) => void
  onEnd?: (data: z.output<T>) => void
  schema: T
  defaultData?: ZodStreamDefaultData<T>
}

export type UseJsonStreamResult<T extends z.ZodObject> = {
  startStream: StartStream
  stopStream: StopStream
  data: ZodStreamValue<T>
  loading: boolean
}
