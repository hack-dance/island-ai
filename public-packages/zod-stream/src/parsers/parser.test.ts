import { describe, expect, test } from "bun:test"
import type OpenAI from "openai"

import { thinkingJsonParser } from "../parsers/thinking"

describe("thinkingJsonParser", () => {
  test("should parse JSON and include thinking content", () => {
    const response = `<thinking>This is a thinking process</thinking>
    
    \`\`\`json
    {
      "result": "test"
    }
    \`\`\`
    `
    const result = thinkingJsonParser(response)
    const parsed = JSON.parse(result.json)

    expect(parsed.result).toBe("test")
    expect(result.thinking).toBe("This is a thinking process")
  })

  test("should create JSON with only thinking when no JSON content", () => {
    const response = "<think>Just thinking about stuff</think>"
    const result = thinkingJsonParser(response)

    expect(result?.thinking).toBeDefined()
    expect(result?.json).toBe("")
  })

  test("should parse JSON without thinking content", () => {
    const response = '```json\n{"test": true}\n```'
    const result = thinkingJsonParser(response)
    const parsed = JSON.parse(result.json)
    expect(parsed.test).toBe(true)
    expect(result.thinking).toBe("")
  })

  test("should handle incomplete JSON in response", () => {
    const response = '```json\n{"test": true'
    const result = thinkingJsonParser(response)
    expect(result.json).toBe('{"test": true')
  })

  test("should handle nested markdown blocks", () => {
    const response = `<thinking>Consider this example:
\`\`\`json
{
  "example": "nested"
}
\`\`\`
Still thinking...</thinking>

\`\`\`json
{
  "final": "result"
}
\`\`\`
`
    const result = thinkingJsonParser(response)
    const parsed = JSON.parse(result.json)
    expect(parsed.final).toBe("result")
    expect(result.thinking).toBe(
      'Consider this example:\n```json\n{\n  "example": "nested"\n}\n```\nStill thinking...'
    )
  })

  test("should handle OpenAI streaming response", () => {
    const response = {
      id: "chatcmpl-123",
      object: "chat.completion",
      created: 1234567890,
      model: "gpt-4",
      choices: [
        {
          message: {
            role: "assistant",
            content: "<thinking>Processing...</thinking>"
          }
        }
      ]
    } as OpenAI.Chat.Completions.ChatCompletion

    const result = thinkingJsonParser(response)

    expect(result?.thinking).toBe("Processing...")
  })

  test("should handle OpenAI non-streaming response", () => {
    const response = {
      id: "chatcmpl-123",
      object: "chat.completion",
      created: 1234567890,
      model: "gpt-4",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `<thinking>Final thoughts</thinking>
            
              \`\`\`json
              {
                "complete": true
              }
              \`\`\`
              `
          }
        }
      ]
    } as OpenAI.Chat.Completions.ChatCompletion

    const result = thinkingJsonParser(response)
    const parsed = JSON.parse(result.json)
    expect(parsed.complete).toBe(true)
    expect(result.thinking).toBe("Final thoughts")
  })

  test("should handle empty or invalid input", () => {
    expect(thinkingJsonParser("")).toEqual({ json: "", thinking: "" })
    expect(thinkingJsonParser("no special content")).toEqual({ json: "", thinking: "" })
  })
})
