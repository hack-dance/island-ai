import { describe, expect, test } from "bun:test"
import { z } from "zod"

import { MODE } from "@/constants/modes"
import { responseModelToJsonSchema, withResponseModel } from "@/response-model"
import type { Mode } from "@/types"

const ExtractionSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string().min(1),
        active: z.boolean()
      })
    )
    .min(1),
  budget: z.coerce.number(),
  note: z.string().optional()
})

const baseParams = {
  messages: [{ role: "user" as const, content: "some text..." }],
  model: "gpt-4o-mini",
  seed: 1
}

function buildParams<M extends Mode>(mode: M) {
  return withResponseModel({
    response_model: {
      schema: ExtractionSchema,
      name: "Extract values!",
      description: "Extract the requested values"
    },
    mode,
    params: baseParams
  })
}

describe("Zod 4 response model conversion", () => {
  test("uses native input JSON Schema and prepares nested objects for OpenAI strict mode", () => {
    const schema = responseModelToJsonSchema(ExtractionSchema)

    expect(schema).toEqual({
      type: "object",
      properties: {
        users: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              name: { type: "string", minLength: 1 },
              active: { type: "boolean" }
            },
            required: ["name", "active"],
            additionalProperties: false
          }
        },
        budget: { type: "number" },
        note: { type: "string" }
      },
      required: ["users", "budget"],
      additionalProperties: false
    })
  })

  test("surfaces unsupported Zod conversion errors", () => {
    const unsupported = z.object({ createdAt: z.date() })

    expect(() => responseModelToJsonSchema(unsupported)).toThrow()
  })
})

describe("withResponseModel modes", () => {
  test("supports every documented mode", () => {
    const results = Object.values(MODE).map(mode => ({ mode, params: buildParams(mode) }))

    expect(results.map(({ mode }) => mode)).toEqual([
      "FUNCTIONS",
      "TOOLS",
      "JSON",
      "MD_JSON",
      "JSON_SCHEMA",
      "THINKING_MD_JSON"
    ])
    for (const { params } of results) {
      expect(params.messages.at(-1)).toEqual(baseParams.messages[0])
      expect(params.model).toBe(baseParams.model)
    }
  })

  test("retains the deprecated function-calling compatibility mode", () => {
    const params = buildParams(MODE.FUNCTIONS)

    expect(params.function_call).toEqual({ name: "Extract_values_" })
    expect(params.functions?.[0]).toMatchObject({
      name: "Extract_values_",
      description: "Extract the requested values",
      parameters: { type: "object", additionalProperties: false }
    })
  })

  test("adds the response model ahead of existing function and custom tools", () => {
    const params = withResponseModel({
      response_model: { schema: ExtractionSchema, name: "Extract" },
      mode: MODE.TOOLS,
      params: {
        ...baseParams,
        tools: [
          {
            type: "custom" as const,
            custom: { name: "grammar", format: { type: "text" as const } }
          }
        ]
      }
    })

    expect(params.tool_choice).toEqual({ type: "function", function: { name: "Extract" } })
    expect(params.tools).toHaveLength(2)
    expect(params.tools[1]?.type).toBe("custom")
  })

  test("uses modern structured outputs for JSON_SCHEMA", () => {
    const params = buildParams(MODE.JSON_SCHEMA)

    expect(params.response_format).toMatchObject({
      type: "json_schema",
      json_schema: {
        name: "Extract_values_",
        description: "Extract the requested values",
        strict: true,
        schema: { type: "object", additionalProperties: false }
      }
    })
  })

  test("keeps JSON mode and both markdown modes message-based", () => {
    const json = buildParams(MODE.JSON)
    const markdown = buildParams(MODE.MD_JSON)
    const thinking = buildParams(MODE.THINKING_MD_JSON)

    expect(json.response_format).toEqual({ type: "json_object" })
    expect(json.messages[0]?.content).toContain('"budget":{"type":"number"}')
    expect(markdown.messages[0]?.content).toContain("fully valid JSON")
    expect(thinking.messages[0]?.content).toContain("<think>")
  })
})
