import type OpenAI from "openai"
import type { SchemaStreamChunk, SchemaStreamDefaultData } from "schema-stream"
import type { z } from "zod"

import { MODE } from "@/constants/modes"

export type ActivePath = (string | number | undefined)[]
export type CompletedPaths = ActivePath[]

export type CompletionMeta = {
  _activePath: ActivePath
  _completedPaths: CompletedPaths
  _isValid: boolean
}

export type ZodStreamChunk<T extends z.ZodObject> = SchemaStreamChunk<T> & {
  _meta: CompletionMeta
}

export type ZodStreamValue<T extends z.ZodObject> = SchemaStreamChunk<T>

export type LogLevel = "debug" | "info" | "warn" | "error"

export type ClientConfig = {
  debug?: boolean
}

export type JsonSchema = z.core.JSONSchema.JSONSchema

export type ParseParams = {
  name: string
  description?: string
  schema: JsonSchema
}

export type Mode = keyof typeof MODE

export type ResponseModel<T extends z.ZodObject> = {
  schema: T
  name: string
  description?: string
}

export type ZodStreamCompletionParams<T extends z.ZodObject> = {
  response_model: { schema: T; name?: string; description?: string }
  data?: Record<string, unknown>
  completionPromise: (data?: Record<string, unknown>) => Promise<ReadableStream<Uint8Array>>
}

export type ZodStreamDefaultData<T extends z.ZodObject> = SchemaStreamDefaultData<T>

export type InferStreamType<T extends OpenAI.ChatCompletionCreateParams> = T extends {
  stream: true
}
  ? OpenAI.ChatCompletionCreateParamsStreaming
  : OpenAI.ChatCompletionCreateParamsNonStreaming

export type FunctionParamsReturnType<T extends OpenAI.ChatCompletionCreateParams> = T & {
  function_call: OpenAI.ChatCompletionFunctionCallOption
  functions: OpenAI.ChatCompletionCreateParams.Function[]
}

export type ToolFunctionParamsReturnType<T extends OpenAI.ChatCompletionCreateParams> = T & {
  tool_choice: OpenAI.ChatCompletionToolChoiceOption
  tools: OpenAI.ChatCompletionTool[]
}

export type MessageBasedParamsReturnType<T extends OpenAI.ChatCompletionCreateParams> = T

export type JsonModeParamsReturnType<T extends OpenAI.ChatCompletionCreateParams> = T & {
  response_format: { type: "json_object" }
  messages: OpenAI.ChatCompletionMessageParam[]
}

export type JsonSchemaParamsReturnType<
  T extends Omit<OpenAI.ChatCompletionCreateParams, "response_format">
> = T & {
  response_format: {
    type: "json_schema"
    json_schema: {
      name: string
      description?: string
      schema: JsonSchema
      strict: true
    }
  }
  messages: OpenAI.ChatCompletionMessageParam[]
}

export type ModeParamsReturnType<
  T extends OpenAI.ChatCompletionCreateParams,
  M extends Mode
> = M extends typeof MODE.FUNCTIONS
  ? FunctionParamsReturnType<T>
  : M extends typeof MODE.TOOLS
    ? ToolFunctionParamsReturnType<T>
    : M extends typeof MODE.JSON
      ? JsonModeParamsReturnType<T>
      : M extends typeof MODE.JSON_SCHEMA
        ? JsonSchemaParamsReturnType<T>
        : MessageBasedParamsReturnType<T>
