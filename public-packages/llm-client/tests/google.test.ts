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

    console.log(completion?.choices?.[0].message.content)
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

    console.log(completion?.choices?.[0].message.content)
    expect(completion?.choices?.[0].message.content).toMatch(/Arlington/i)
  })

  test("Streaming Chat", async () => {
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-latest",
      messages: [
        {
          role: "user",
          //content: "Write a soliloquy about the humidity."
          content: "Write an essay about the chemical composition of dirt."
        }
      ],
      max_tokens: 1000,
      stream: true
    })

    let final = ""
    for await (const message of completion) {
      console.log("choice: ", message.choices?.[0])
      final += message.choices?.[0].delta?.content ?? ""
    }
    console.log(final)
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
              //additionalProperties: false
            }
          }
        }
      ]
    })

    const responseFunction = completion?.choices?.[0]?.message.tool_calls?.[0].function
    console.log({ responseFunction })
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
              //additionalProperties: false
            }
          }
        }
      ]
    })

    for await (const message of completion) {
      console.log("choice: ", message.choices?.[0])
    }
  })
})
