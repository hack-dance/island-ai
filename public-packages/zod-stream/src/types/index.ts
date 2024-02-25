import OpenAI from "openai"
import { z } from "zod"
import { JsonSchema7Type } from "zod-to-json-schema"

import { MODE } from "@/constants/modes"

export type ActivePath = (string | number | undefined)[]
export type CompletedPaths = ActivePath[]

export type CompletionMeta = {
  _activePath: ActivePath
  _completedPaths: CompletedPaths
  _isValid: boolean
}

export type LogLevel = "debug" | "info" | "warn" | "error"

export type ClientConfig = {
  debug?: boolean
}

export type ParseParams = {
  name: string
  description?: string
} & JsonSchema7Type

export type Mode = keyof typeof MODE

export type ResponseModel<T extends z.AnyZodObject> = {
  schema: T
  name: string
  description?: string
}

export type ZodStreamCompletionParams<T extends z.AnyZodObject> = {
  response_model: { schema: T }
  data?: Record<string, unknown>
  completionPromise: (data?: Record<string, unknown>) => Promise<ReadableStream<Uint8Array>>
}

export type InferStreamType<T extends OpenAI.ChatCompletionCreateParams> = T extends {
  stream: true
}
  ? OpenAI.ChatCompletionCreateParamsStreaming
  : OpenAI.ChatCompletionCreateParamsNonStreaming

export type FunctionParamsReturnType<T extends OpenAI.ChatCompletionCreateParams> = T & {
  function_call: OpenAI.ChatCompletionFunctionCallOption
  functions: OpenAI.FunctionDefinition[]
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
    type: "json_object"
    schema: JsonSchema7Type
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
        : M extends typeof MODE.MD_JSON
          ? MessageBasedParamsReturnType<T>
          : MessageBasedParamsReturnType<T>
