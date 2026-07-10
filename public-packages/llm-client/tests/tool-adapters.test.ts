import { AnthropicProvider } from "@/providers/anthropic"
import { GoogleProvider } from "@/providers/google"
import type { AnthropicChatCompletionParams, GoogleChatCompletionParams } from "@/types"
import { describe, expect, mock, test } from "bun:test"

const functionTool = {
  type: "function" as const,
  function: {
    name: "lookup_weather",
    description: "Look up the weather",
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"]
    }
  }
}

const customTool = {
  type: "custom" as const,
  custom: {
    name: "shell",
    description: "Run a command",
    format: { type: "text" as const }
  }
}

describe("provider tool adapters", () => {
  test("Anthropic forwards function tools and excludes OpenAI custom tools", () => {
    const provider = new AnthropicProvider({ apiKey: "test-key", logLevel: "error" })
    const internals = provider as unknown as {
      transformParamsRegular(
        params: AnthropicChatCompletionParams
      ): { tools: unknown[]; tool_choice?: unknown }
    }

    const transformed = internals.transformParamsRegular({
      model: "test-model",
      max_tokens: 100,
      messages: [{ role: "user", content: "weather" }],
      tools: [functionTool, customTool],
      tool_choice: { type: "function", function: { name: "lookup_weather" } }
    })

    expect(transformed.tools).toEqual([
      {
        name: "lookup_weather",
        description: "Look up the weather",
        input_schema: functionTool.function.parameters
      }
    ])
    expect(transformed.tool_choice).toEqual({ type: "tool", name: "lookup_weather" })
  })

  test("Google forwards function tools and excludes OpenAI custom tools", async () => {
    const provider = new GoogleProvider({ apiKey: "test-key", logLevel: "error" })
    const startChat = mock((params: unknown) => params)
    const internals = provider as unknown as {
      getChatSession(params: GoogleChatCompletionParams): Promise<unknown>
      getGenerativeModel(config: unknown): { startChat: typeof startChat }
    }
    internals.getGenerativeModel = () => ({ startChat })

    await internals.getChatSession({
      model: "test-model",
      max_tokens: 100,
      messages: [{ role: "user", content: "weather" }],
      tools: [functionTool, customTool],
      tool_choice: { type: "function", function: { name: "lookup_weather" } }
    })

    expect(startChat).toHaveBeenCalledTimes(1)
    expect(startChat.mock.calls[0]?.[0]).toMatchObject({
      tools: [
        {
          functionDeclarations: [
            {
              name: "lookup_weather",
              description: "Look up the weather",
              parameters: functionTool.function.parameters
            }
          ]
        }
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: "ANY",
          allowedFunctionNames: ["lookup_weather"]
        }
      }
    })
  })
})
