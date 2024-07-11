import { createLLMClient } from "@/index"
import { describe, expect, test } from "bun:test"

const googleClient = createLLMClient({
  provider: "google",
  logLevel: "error"
})

describe(`LLMClient Gemini Provider`, () => {
  test("Simple Chat", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What is the capital of Montana?"
        }
      ],
      max_tokens: 1000
    })

    console.log({ completion })

    expect(completion).toMatch(/Helena/i)
  })

  test.skip("Streaming Chat", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "Write a soliloquy about the humidity."
        }
      ],
      max_tokens: 1000,
      stream: true
    })

    expect(completion).toBeTruthy
  })

  test.skip("Function calling", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What is the capital of Montana?"
        }
      ],
      max_tokens: 1000,
      tool_choice: {
        type: "function",
        function: {
          name: "say_hello"
        }
      },
      tools: [
        {
          type: "function",
          function: {
            name: "say_hello",
            description: "Say hello",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string"
                }
              },
              required: ["name"],
              additionalProperties: false
            }
          }
        }
      ]
    })
  })
})
