import { z } from "zod"

export type InstructorConfig = {
  debug?: boolean
}

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

export type InstructorChatCompletionParams<T extends z.AnyZodObject> = {
  response_model: ResponseModel<T>
  params: CompletionParams
  completionPromise: (params: CompletionParams) => Promise<Promise<ReadableStream<Uint8Array>>>
}
