import {
  OAIBuildFunctionParams,
  OAIBuildJsonModeParams,
  OAIBuildJsonSchemaParams,
  OAIBuildMessageBasedParams,
  OAIBuildToolFunctionParams
} from "@/oai/params"
import { ParseParams } from "@/types"

export const MODE = {
  FUNCTIONS: "FUNCTIONS",
  TOOLS: "TOOLS",
  JSON: "JSON",
  MD_JSON: "MD_JSON",
  JSON_SCHEMA: "JSON_SCHEMA"
} as const

export const MODE_TO_PARAMS = {
  [MODE.FUNCTIONS]: OAIBuildFunctionParams,
  [MODE.TOOLS]: OAIBuildToolFunctionParams,
  [MODE.MD_JSON]: OAIBuildMessageBasedParams,
  [MODE.JSON]: OAIBuildJsonModeParams,
  [MODE.JSON_SCHEMA]: OAIBuildJsonSchemaParams
}

export type ModeSpecificConfigs = {
  [MODE.JSON]: {
    response_format: { type: "json_object" }
  }
  [MODE.JSON_SCHEMA]: {
    response_format: {
      type: "json_object"
      schema: ParseParams
    }
  }
}
