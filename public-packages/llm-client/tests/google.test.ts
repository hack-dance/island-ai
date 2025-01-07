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

    expect(completion?.choices?.[0].message.content).toMatch(/Helena/i)
  })

  test("Chat completion with context", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
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
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
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
      final += message.choices?.[0].delta?.content ?? ""
    }
    expect(final).toBeString()
  })

  test("Function calling", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: "My name is Spartacus."
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
              required: ["name"]
            }
          }
        }
      ]
    })

    const responseFunction = completion?.choices?.[0]?.message.tool_calls?.[0].function
    expect(responseFunction?.name).toMatch(/say_hello/i)
    expect(responseFunction?.arguments).toMatch(/Spartacus/i)
  })

  test("Function calling - streaming", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      max_tokens: 1000,
      stream: true,
      messages: [
        {
          role: "user",
          content: "My name is Spartacus."
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
              required: ["name"]
            }
          }
        }
      ]
    })

    let final = ""
    for await (const message of completion) {
      final += message.choices?.[0].delta?.content ?? ""
    }

    console.log(final)
  })

  test("Chat with system messages", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        { role: "system", content: "You only speak French." },
        { role: "system", content: "You only speak in rhymes." },
        {
          role: "user",
          content:
            "What is the capital of Montana? Be sure to use the word capital in your response."
        }
      ],
      max_tokens: 1000
    })

    expect(completion?.choices?.[0].message.content).toMatch(/capitale/i)
  })

  test("Chat with cache context", async () => {
    // First create some cached content
    // gemini-1.5-flash-latest somehow doesn't support caching OOTB (11/18/24)
    const cacheResponse = await googleClient.cacheManager.create({
      model: "gemini-1.5-flash-8b",
      messages: [
        {
          role: "user",
          content: "What is the capital of Montana?"
        }
      ],
      ttlSeconds: 3600, // Cache for 1 hour,
      max_tokens: 1000
    })

    // Now use the cached content in a new completion
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-8b",
      messages: [
        {
          role: "user",
          content: "What state is it in?"
        }
      ],
      additionalProperties: {
        cacheName: cacheResponse.name
      },
      max_tokens: 1000
    })

    expect(completion?.choices?.[0].message.content).toMatch(/Montana/i)
  })
})

test("Chat with search", async () => {
  const completion = await googleClient.chat.completions.create({
    model: "gemini-1.5-flash-latest",
    messages: [
      {
        role: "user",
        content: "Give me some of the best ice cream places in Boston"
      }
    ],
    max_tokens: 1000,
    groundingThreshold: 0.7
  })

  console.log(completion?.choices?.[0].message.content)

  expect(completion?.choices?.[0].message.content).toMatch(/J.P. Licks/i)
})
