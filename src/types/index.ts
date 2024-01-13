import { z } from "zod"

import { MODE } from "@/constants/modes"

export type InstructorConfig = {
  debug?: boolean
}

export type Mode = keyof typeof MODE

export type ResponseModel<T extends z.ZodTypeAny> = {
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

export type AIUICompletionParams<T extends z.AnyZodObject> = {
  response_model: { schema: T }
  data?: Record<string, unknown>
  completionPromise: (data?: Record<string, unknown>) => Promise<ReadableStream<Uint8Array>>
}
