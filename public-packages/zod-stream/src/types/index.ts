import { z } from "zod"

import { MODE } from "@/constants/modes"

export type LogLevel = "debug" | "info" | "warn" | "error"

export type ClientConfig = {
  debug?: boolean
}

export type Mode = keyof typeof MODE

export type ResponseModel<T extends z.AnyZodObject> = {
  schema: T
  name: string
  description?: string
}

type ChatCompletionMessageParam = {
  role: "user" | "assistant" | "system"
  content: string
  data?: unknown
}

export type CompletionParams = {
  messages: ChatCompletionMessageParam[]
}

export type ZodStreamCompletionParams<T extends z.AnyZodObject> = {
  response_model: { schema: T }
  data?: Record<string, unknown>
  completionPromise: (data?: Record<string, unknown>) => Promise<ReadableStream<Uint8Array>>
}
