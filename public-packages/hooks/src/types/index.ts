import z from "zod"

export interface StartStream {
  (args: StartStreamArgs): void
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

export interface UseJsonStreamProps<T extends z.ZodType<any, any>> extends UseStreamProps {
  onReceive?: (data: Partial<z.infer<T>>) => void
  onEnd?: (data: z.infer<T>) => void
  schema: T
  defaultData?: Partial<z.infer<T>>
}
