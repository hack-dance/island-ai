import { createLLMClient } from "@/index"
import { describe, expect, test } from "bun:test"

describe("LLMClient Anthropic Provider", () => {
  const anthropicClient = createLLMClient({
    provider: "anthropic"
  })

  test("Function Calling standard", async () => {
    const completion = await anthropicClient.chat.completions.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: "My name is Dimitri Kennedy."
        }
      ],
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

    expect(completion?.choices?.[0]?.message.tool_calls).toEqual([
      {
        id: "0-say_hello",
        type: "function",
        function: {
          name: "say_hello",
          arguments: '{"name":"Dimitri Kennedy"}'
        }
      }
    ])
  })

  test("Function Calling stream", async () => {
    const completion = await anthropicClient.chat.completions.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      stream: true,
      messages: [
        {
          role: "user",
          content: "My name is Dimitri Kennedy."
        }
      ],
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

    let final = {}
    for await (const data of completion) {
      final = data
    }

    // @ts-expect-error not typing this
    expect(final?.choices?.[0]?.delta.tool_calls).toEqual([
      {
        index: 0,
        id: "0-say_hello",
        type: "function",
        function: {
          name: "say_hello",
          arguments: '{"name":"Dimitri Kennedy"}'
        }
      }
    ])
  })

  test("Standard completion", async () => {
    const completion = await anthropicClient.chat.completions.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: "hey how are you"
        }
      ]
    })

    expect(completion).toBeDefined()
    expect(completion?.choices?.[0].message.content).toBeDefined()
  })

  test("Stream completion", async () => {
    const completion = await anthropicClient.chat.completions.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      stream: true,
      messages: [
        {
          role: "user",
          content: "hey how are you"
        }
      ]
    })

    let final = ""

    for await (const data of completion) {
      final += data.choices?.[0]?.delta?.content ?? ""
    }

    expect(final.length).toBeGreaterThan(0)
  })
})
