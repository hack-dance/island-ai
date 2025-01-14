import { createLLMClient } from "@/index"
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
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
        { role: "user", content: "Who won the world series in 2020?" },
        { role: "assistant", content: "The Los Angeles Dodgers won the World Series in 2020." },
        { role: "user", content: "Where was it played?" }
      ],
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toMatch(/Arlington/i)
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
      stream: false,
      messages: [
        {
          role: "user",
          content: "Call the say_hello function with my name. My name is Spartacus."
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
            description: "Call this function to say hello to someone by name",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the person to greet"
                }
              },
              required: ["name"]
            }
          }
        }
      ]
    })

    const responseFunction = completion?.choices?.[0]?.message?.tool_calls?.[0]?.function
    expect(responseFunction).toBeTruthy()
    if (responseFunction) {
      expect(responseFunction.name).toBe("say_hello")
      const args = JSON.parse(responseFunction.arguments)
      expect(args).toHaveProperty("name")
      expect(args.name).toBe("Spartacus")
    }
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
                  type: "string",
                  description: "The name of the person to greet"
                }
              },
              required: ["name"]
            }
          }
        }
      ]
    })

    const toolCalls = []
    for await (const message of completion) {
      const deltaCalls = message.choices?.[0]?.delta?.tool_calls
      if (deltaCalls) {
        toolCalls.push(...deltaCalls)
      }
    }

    expect(toolCalls.length).toBeGreaterThan(0)
    const functionCall = toolCalls[0]?.function
    expect(functionCall).toBeTruthy()
    if (functionCall) {
      expect(functionCall.name).toBe("say_hello")
      const args = JSON.parse(functionCall.arguments ?? "{}")
      expect(args).toHaveProperty("name")
      expect(args.name).toBe("Spartacus")
    }
  })

  test("Chat with role-based instructions", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "You are a French poet. Write a short poem about Montana's capital Helena."
        }
      ],
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toMatch(/Helena|capitale/i)
  })

  test("Chat with multiple role-based instructions", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      systemInstruction: "You are a historian.",
      messages: [
        {
          role: "user",
          content: "What happened in Helena, Montana in 1864?"
        },
        {
          role: "system",
          content:
            "Helena was founded in 1864 during the Montana gold rush when gold was discovered in Last Chance Gulch."
        },
        {
          role: "user",
          content: "Now respond as a tour guide. What are some historical sites to visit there?"
        }
      ],
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toMatch(
      /Last Chance Gulch|Montana State Capitol|Cathedral/i
    )
  })

  test("Chat with grounding - local search", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What are some popular restaurants in Boston's North End right now?"
        }
      ],
      groundingThreshold: 0.8,
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toMatch(/restaurant|Italian|North End/i)
  })

  test("Chat with grounding - current events", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What are the latest developments in AI technology this month?"
        }
      ],
      groundingThreshold: 0.9,
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
    // The response should contain recent information
    expect(completion?.choices?.[0]?.message.content).toMatch(/202[3-4]|AI|development/i)
  })

  test("Chat with grounding and role-based instructions", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content:
            "You are a food critic. Review the most popular Italian restaurants in Boston's North End, focusing on their traditional dishes."
        }
      ],
      groundingThreshold: 0.7,
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
    expect(completion?.choices?.[0]?.message.content).toMatch(/restaurant|Italian|pasta|North End/i)
  })

  test("Chat with different grounding thresholds", async () => {
    // High threshold for more factual responses
    const highThreshold = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What are the current top-rated restaurants in Boston?"
        }
      ],
      groundingThreshold: 0.9,
      max_tokens: 1000,
      stream: false
    })

    // Lower threshold for more general responses
    const lowThreshold = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What are the current top-rated restaurants in Boston?"
        }
      ],
      groundingThreshold: 0.5,
      max_tokens: 1000,
      stream: false
    })

    expect(highThreshold?.choices?.[0]?.message.content).toBeTruthy()
    expect(lowThreshold?.choices?.[0]?.message.content).toBeTruthy()
    // Responses should be different due to different thresholds
    expect(highThreshold?.choices?.[0]?.message.content).not.toBe(
      lowThreshold?.choices?.[0]?.message.content
    )
  })

  test("Chat with safety settings", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "Tell me a children's story about friendship"
        }
      ],
      additionalProperties: {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          }
        ]
      },
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
  })

  test("Chat with model generation config", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "Write a creative story about a robot"
        }
      ],
      additionalProperties: {
        modelGenerationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 200
        }
      },
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
  })

  test("Chat with session management", async () => {
    const sessionId = "test-session-1"

    // First message in session
    const completion1 = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "My name is Alice"
        }
      ],
      additionalProperties: {
        sessionId
      },
      max_tokens: 1000,
      stream: false
    })

    expect(completion1?.choices?.[0]?.message.content).toBeTruthy()

    // Second message in same session
    const completion2 = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What's my name?"
        }
      ],
      additionalProperties: {
        sessionId
      },
      max_tokens: 1000,
      stream: false
    })

    expect(completion2?.choices?.[0]?.message.content).toMatch(/Alice/i)
  })

  test("Chat with grounding", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "What are some popular restaurants in New York City's Little Italy?"
        }
      ],
      groundingThreshold: 0.7,
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
    expect(completion?.choices?.[0]?.message.content).toMatch(/restaurant|Italian/i)
  })

  test("Chat with combined features", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          content: "Suggest some highly-rated Italian restaurants in Boston's North End"
        }
      ],
      groundingThreshold: 0.7,
      additionalProperties: {
        sessionId: "restaurant-session",
        modelGenerationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300
        }
      },
      max_tokens: 1000,
      stream: false
    })

    expect(completion?.choices?.[0]?.message.content).toBeTruthy()
    expect(completion?.choices?.[0]?.message.content).toMatch(/restaurant|Italian/i)
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

  expect(completion?.choices?.[0].message.content).toMatch(/J.P. Licks/i)
})
