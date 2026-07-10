import {
  FunctionParamsReturnType,
  JsonModeParamsReturnType,
  JsonSchemaParamsReturnType,
  MessageBasedParamsReturnType,
  ParseParams,
  ToolFunctionParamsReturnType
} from "@/types"
import OpenAI from "openai"

export function OAIBuildFunctionParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): FunctionParamsReturnType<T> {
  const { name, description, schema } = definition

  const function_call: OpenAI.ChatCompletionFunctionCallOption = {
    name
  }

  const functions: OpenAI.FunctionDefinition[] = [
    ...(params?.functions ?? []),
    {
      name: name,
      description: description ?? undefined,
      parameters: schema
    }
  ]

  return {
    ...params,
    function_call,
    functions
  }
}

export function OAIBuildToolFunctionParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): ToolFunctionParamsReturnType<T> {
  const { name, description, schema } = definition

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
        parameters: schema
      }
    },
    ...(params.tools ?? [])
  ]

  return {
    ...params,
    tool_choice,
    tools
  }
}

export function OAIBuildMessageBasedParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): MessageBasedParamsReturnType<T> {
  return {
    ...params,
    messages: [
      {
        role: "system",
        content: `
          Given a user prompt, you will return fully valid JSON based on the following description and schema.
          You will return no other prose. You will take into account any descriptions or required parameters within the schema
          and return a valid and fully escaped JSON object that matches the schema and those instructions.

          description: ${definition.description}
          json schema: ${JSON.stringify(definition.schema)}
        `
      },
      ...params.messages
    ]
  }
}

export function OAIBuildThinkingMessageBasedParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): MessageBasedParamsReturnType<T> {
  return {
    ...params,
    messages: [
      {
        role: "system",
        content: `
          Given a user prompt, you will return fully valid JSON based on the provided description and schema.

          You will take into account any descriptions or required parameters within the schema
          and return a valid and fully escaped JSON object that matches the schema and those instructions.

          You will always return your full thought process in one <think> tag and then return the JSON response in a \`\`\`json block after the </think> tag. Never include any prose or thinking process outside of the <think> tag.
          
          For example:
            <think>
              I am analyzing the input to extract the required information...
            </think>

              \`\`\`json
              {
                "result": "the actual json response"
              }
              \`\`\`

          \n\n

          description: ${definition.description}
          json schema: ${JSON.stringify(definition.schema)}
        `
      },
      ...params.messages
    ]
  }
}

export function OAIBuildJsonModeParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): JsonModeParamsReturnType<T> {
  return {
    ...params,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
          Given a user prompt, you will return fully valid JSON based on the following description and schema.
          You will return no other prose. You will take into account any descriptions or required parameters within the schema
          and return a valid and fully escaped JSON object that matches the schema and those instructions.

          description: ${definition.description}
          json schema: ${JSON.stringify(definition.schema)}
        `
      },
      ...params.messages
    ]
  }
}

export function OAIBuildJsonSchemaParams<T extends OpenAI.ChatCompletionCreateParams>(
  definition: ParseParams,
  params: T
): JsonSchemaParamsReturnType<T> {
  return {
    ...params,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: definition.name,
        description: definition.description || undefined,
        schema: definition.schema,
        strict: true
      }
    },
    messages: [
      {
        role: "system",
        content: `
          Given a user prompt, you will return fully valid JSON based on the following description.
          You will return no other prose. You will take into account any descriptions or required parameters within the schema
          and return a valid and fully escaped JSON object that matches the schema and those instructions.

          description: ${definition.description}
        `
      },
      ...params.messages
    ]
  }
}
