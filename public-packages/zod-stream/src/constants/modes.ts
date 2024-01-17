import { Mode } from "@/types"
import OpenAI from "openai"

export const MODE = {
  FUNCTIONS: "FUNCTIONS",
  TOOLS: "TOOLS",
  JSON: "JSON",
  MD_JSON: "MD_JSON",
  JSON_SCHEMA: "JSON_SCHEMA"
} as const

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

export type ModeParamsReturnType<
  T extends OpenAI.ChatCompletionCreateParams,
  M extends Mode
> = M extends typeof MODE.FUNCTIONS
  ? FunctionParamsReturnType<T>
  : M extends typeof MODE.TOOLS
    ? ToolFunctionParamsReturnType<T>
    : MessageBasedParamsReturnType<T>
