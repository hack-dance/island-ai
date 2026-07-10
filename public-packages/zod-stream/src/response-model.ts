import type OpenAI from "openai"
import { z } from "zod"

import { MODE } from "@/constants/modes"
import {
  OAIBuildFunctionParams,
  OAIBuildJsonModeParams,
  OAIBuildJsonSchemaParams,
  OAIBuildMessageBasedParams,
  OAIBuildThinkingMessageBasedParams,
  OAIBuildToolFunctionParams
} from "@/oai/params"
import type { JsonSchema, Mode, ModeParamsReturnType, ResponseModel } from "@/types"

function makeOpenAIStrictSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(makeOpenAIStrictSchema)
  }

  if (typeof value !== "object" || value === null) {
    return value
  }

  const schema = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, makeOpenAIStrictSchema(nestedValue)])
  )

  if (schema["type"] === "object" && !("additionalProperties" in schema)) {
    schema["additionalProperties"] = false
  }

  return schema
}

/** Converts a Zod 4 input schema to the JSON Schema dialect accepted by Chat Completions. */
export function responseModelToJsonSchema(schema: z.ZodObject): JsonSchema {
  const { $schema: _dialect, ...jsonSchema } = z.toJSONSchema(schema, {
    target: "draft-07",
    io: "input",
    unrepresentable: "throw"
  })

  return makeOpenAIStrictSchema(jsonSchema) as JsonSchema
}

export function withResponseModel<
  T extends z.ZodObject,
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
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64)

  if (!safeName) {
    throw new Error("response_model.name must contain at least one letter, number, underscore, or dash")
  }

  const definition = {
    name: safeName,
    description,
    schema: responseModelToJsonSchema(schema)
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

  if (mode === MODE.THINKING_MD_JSON) {
    return OAIBuildThinkingMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>
  }

  return OAIBuildMessageBasedParams<P>(definition, params) as ModeParamsReturnType<P, M>
}
