import { omit } from "@/lib"
import { Mode } from "@/types"
import OpenAI from "openai"
import { ChatCompletionCreateParams } from "openai/resources/index.mjs"
import { JsonSchema7Type } from "zod-to-json-schema"

import {
  FunctionParamsReturnType,
  MessageBasedParamsReturnType,
  MODE,
  ToolFunctionParamsReturnType
} from "@/constants/modes"

type ParseParams = {
  name: string
  description?: string
} & JsonSchema7Type

export function OAIBuildFunctionParams<T extends ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): FunctionParamsReturnType<T> {
  const { name, description, ...definitionParams } = definition

  const function_call: OpenAI.ChatCompletionFunctionCallOption = {
    name
  }

  const functions: OpenAI.FunctionDefinition[] = [
    ...(params?.functions ?? []),
    {
      name: name,
      description: description ?? undefined,
      parameters: definitionParams
    }
  ]

  return {
    ...params,
    function_call,
    functions
  }
}

export function OAIBuildToolFunctionParams<T extends OpenAI.Chat.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): ToolFunctionParamsReturnType<T> {
  const { name, description, ...definitionParams } = definition

  const tool_choice: OpenAI.ChatCompletionToolChoiceOption = {
    type: "function",
    function: { name }
  }

  const tools: OpenAI.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: name,
        description: description,
        parameters: definitionParams
      }
    },
    ...(params.tools?.map(
      (tool): OpenAI.ChatCompletionTool => ({
        type: tool.type,
        function: {
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters
        }
      })
    ) ?? [])
  ]

  return {
    ...params,
    tool_choice,
    tools
  }
}

export function OAIBuildMessageBasedParams<T extends ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T,
  mode: Mode
): MessageBasedParamsReturnType<T> {
  const MODE_SPECIFIC_CONFIGS: Record<Mode, any> = {
    [MODE.FUNCTIONS]: {},
    [MODE.TOOLS]: {},
    [MODE.JSON]: {
      response_format: { type: "json_object" }
    },
    [MODE.MD_JSON]: {},
    [MODE.JSON_SCHEMA]: {
      response_format: {
        type: "json_object",
        schema: omit(["name", "description"], definition)
      }
    }
  }

  const modeConfig = MODE_SPECIFIC_CONFIGS[mode]

  const t = {
    ...params,
    ...modeConfig,
    stream: params.stream ?? false,
    messages: [
      ...params.messages,
      {
        role: "system",
        content: `
          Given a user prompt, you will return fully valid JSON based on the following description and schema.
          You will return no other prose. You will take into account any descriptions or required parameters within the schema
          and return a valid and fully escaped JSON object that matches the schema and those instructions.

          description: ${definition.description}
          json schema: ${JSON.stringify(definition)}
        `
      }
    ]
  }
  return t
}
