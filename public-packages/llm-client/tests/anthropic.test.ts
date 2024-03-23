import { createLLMClient } from "@/index"
import { describe, expect, test } from "bun:test"

describe("LLMClient Anthropic Provider", () => {
  const anthropicClient = createLLMClient({
    provider: "anthropic"
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

    for await (const data of completion) {
      expect(data?.choices?.[0].delta.content).toBeDefined()
    }

    expect(completion).toBeDefined()
  })
})
