import { withResponseModel } from "@/response-model"
import { Mode } from "@/types"
import { describe, expect, test } from "bun:test"
import z from "zod"

const ExtractionValuesSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string(),
        handle: z.string(),
        twitter: z.string()
      })
    )
    .min(3),
  location: z.string(),
  budget: z.number()
})

function buildParams(mode: Mode) {
  const params = withResponseModel({
    response_model: { schema: ExtractionValuesSchema, name: "Extract" },
    mode: mode,
    params: {
      messages: [{ role: "user", content: "some text..." }],
      model: "gpt-4",
      seed: 1
    }
  })

  return params as unknown
}

describe("WithResponseModel output", () => {
  const functions = buildParams("FUNCTIONS")
  const tools = buildParams("TOOLS")
  const json = buildParams("JSON")
  const jsonSchema = buildParams("JSON_SCHEMA")
  const mdJson = buildParams("MD_JSON")

  test("Mode Function matches expected output", async () => {
    expect(functions).toEqual({
      messages: [
        {
          role: "user",
          content: "some text..."
        }
      ],
      model: "gpt-4",
      seed: 1,
      function_call: {
        name: "Extract"
      },
      functions: [
        {
          name: "Extract",
          description: "",
          parameters: {
            type: "object",
            properties: {
              users: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string"
                    },
                    handle: {
                      type: "string"
                    },
                    twitter: {
                      type: "string"
                    }
                  },
                  required: ["name", "handle", "twitter"],
                  additionalProperties: false
                },
                minItems: 3
              },
              location: {
                type: "string"
              },
              budget: {
                type: "number"
              }
            },
            required: ["users", "location", "budget"],
            additionalProperties: false
          }
        }
      ]
    })
  })
  test("Mode Tools matches expected output", async () => {
    expect(tools).toEqual({
      messages: [
        {
          role: "user",
          content: "some text..."
        }
      ],
      model: "gpt-4",
      seed: 1,
      tool_choice: {
        type: "function",
        function: {
          name: "Extract"
        }
      },
      tools: [
        {
          type: "function",
          function: {
            name: "Extract",
            description: "",
            parameters: {
              type: "object",
              properties: {
                users: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string"
                      },
                      handle: {
                        type: "string"
                      },
                      twitter: {
                        type: "string"
                      }
                    },
                    required: ["name", "handle", "twitter"],
                    additionalProperties: false
                  },
                  minItems: 3
                },
                location: {
                  type: "string"
                },
                budget: {
                  type: "number"
                }
              },
              required: ["users", "location", "budget"],
              additionalProperties: false
            }
          }
        }
      ]
    })
  })
  test("Mode json matches expected output", async () => {
    expect(json).toEqual({
      messages: [
        {
          role: "system",
          content:
            '\n          Given a user prompt, you will return fully valid JSON based on the following description and schema.\n          You will return no other prose. You will take into account any descriptions or required parameters within the schema\n          and return a valid and fully escaped JSON object that matches the schema and those instructions.\n\n          description: \n          json schema: {"name":"Extract","description":"","type":"object","properties":{"users":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"handle":{"type":"string"},"twitter":{"type":"string"}},"required":["name","handle","twitter"],"additionalProperties":false},"minItems":3},"location":{"type":"string"},"budget":{"type":"number"}},"required":["users","location","budget"],"additionalProperties":false}\n        '
        },
        {
          role: "user",
          content: "some text..."
        }
      ],
      model: "gpt-4",
      seed: 1,
      response_format: {
        type: "json_object"
      }
    })
  })
  test("Mode json_schema matches expected output", async () => {
    expect(jsonSchema).toEqual({
      messages: [
        {
          role: "system",
          content:
            "\n          Given a user prompt, you will return fully valid JSON based on the following description.\n          You will return no other prose. You will take into account any descriptions or required parameters within the schema\n          and return a valid and fully escaped JSON object that matches the schema and those instructions.\n\n          description: \n        "
        },
        {
          role: "user",
          content: "some text..."
        }
      ],
      model: "gpt-4",
      seed: 1,
      response_format: {
        type: "json_object",
        schema: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string"
                  },
                  handle: {
                    type: "string"
                  },
                  twitter: {
                    type: "string"
                  }
                },
                required: ["name", "handle", "twitter"],
                additionalProperties: false
              },
              minItems: 3
            },
            location: {
              type: "string"
            },
            budget: {
              type: "number"
            }
          },
          required: ["users", "location", "budget"],
          additionalProperties: false
        }
      }
    })
  })
  test("Mode md_json matches expected output", async () => {
    expect(mdJson).toEqual({
      messages: [
        {
          role: "system",
          content:
            '\n          Given a user prompt, you will return fully valid JSON based on the following description and schema.\n          You will return no other prose. You will take into account any descriptions or required parameters within the schema\n          and return a valid and fully escaped JSON object that matches the schema and those instructions.\n\n          description: \n          json schema: {"name":"Extract","description":"","type":"object","properties":{"users":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"handle":{"type":"string"},"twitter":{"type":"string"}},"required":["name","handle","twitter"],"additionalProperties":false},"minItems":3},"location":{"type":"string"},"budget":{"type":"number"}},"required":["users","location","budget"],"additionalProperties":false}\n        '
        },
        {
          role: "user",
          content: "some text..."
        }
      ],
      model: "gpt-4",
      seed: 1
    })
  })
})
