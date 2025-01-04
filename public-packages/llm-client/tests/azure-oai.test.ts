import { createLLMClient } from "@/index"
import { describe, expect, test } from "bun:test"

const azureOpenAIClient = createLLMClient({
  provider: "azure-openai"
})

describe(`LLMClient Azure OpenAI Provider`, () => {
  test("Simple Chat", async () => {
    const completion = await azureOpenAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "What is the capital of Montana?"
        }
      ],
      max_tokens: 1000
    })

    expect(completion?.choices?.[0].message.content).toMatch(/Helena/i)
  })

  test("Chat completion with context", async () => {
    const completion = await azureOpenAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        { role: "assistant", content: "The Los Angeles Dodgers won the World Series in 2020." },
        { role: "user", content: "Where was it played?" }
      ],
      max_tokens: 1000
    })

    expect(completion?.choices?.[0].message.content).toMatch(/Arlington/i)
  })

  test("Streaming Chat", async () => {
    const completion = await azureOpenAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Write a brief 200 word essay about the chemical composition of dirt."
        }
      ],
      max_tokens: 1000,
      stream: true
    })

    let final = ""
    for await (const message of completion) {
      final += message.choices?.[0]?.delta?.content ?? ""
    }
    expect(final).toBeString()
  })
})
