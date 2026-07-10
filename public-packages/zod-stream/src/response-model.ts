import {
  OAIBuildFunctionParams,
  OAIBuildJsonModeParams,
  OAIBuildJsonSchemaParams,
  OAIBuildMessageBasedParams,
  OAIBuildThinkingMessageBasedParams,
  OAIBuildToolFunctionParams
} from "@/oai/params"
import OpenAI from "openai"
import zodToJsonSchema, { JsonSchema7Type } from "zod-to-json-schema"
import { z } from "zod/v3"

import { MODE } from "@/constants/modes"

import { Mode, ModeParamsReturnType, ResponseModel } from "./types"

type Zod3JsonSchemaResult = JsonSchema7Type & {
  definitions?: Record<string, JsonSchema7Type>
}

const convertZod3ToJsonSchema = zodToJsonSchema as unknown as (
  schema: z.ZodTypeAny,
  options: { name: string; errorMessages: boolean }
) => Zod3JsonSchemaResult

export function withResponseModel<
  T extends z.AnyZodObject,
  M extends Mode,
  P extends OpenAI.ChatCompletionCreateParams
>({
  response_model: { name, schema, description = "" },
  mode,
  params
}: {
  response_model: ResponseModel<T>
  mode: M
  params: P
}): ModeParamsReturnType<P, M> {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, "_").replace(/\s/g, "_")

  const { definitions } = convertZod3ToJsonSchema(schema, {
    name: safeName,
    errorMessages: true
  })

  if (!definitions || !definitions?.[safeName]) {
    console.warn("Could not extract json schema definitions from your schema", schema)
    throw new Error("Could not extract json schema definitions from your schema")
  }

  const definition = {
    name: safeName,
    description,
    ...definitions[safeName]
  }

  if (mode === MODE.FUNCTIONS) {
    return OAIBuildFunctionParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  if (mode === MODE.TOOLS) {
    return OAIBuildToolFunctionParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  if (mode === MODE.JSON) {
    return OAIBuildJsonModeParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  if (mode === MODE.JSON_SCHEMA) {
    return OAIBuildJsonSchemaParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  if (mode === MODE.MD_JSON) {
    return OAIBuildMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  if (mode === MODE.THINKING_MD_JSON) {
    return OAIBuildThinkingMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  return OAIBuildMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>
}
