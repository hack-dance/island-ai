import { createLLMClient } from "@/index"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"

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

  test("Function Calling complex schema", async () => {
    const completion = await anthropicClient.chat.completions.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      stream: true,
      messages: [
        {
          role: "user",
          content: `User Data Submission:

          First Name: John
          Last Name: Doe
          Contact Details:
          Email: john.doe@example.com
          Phone Number: 555-1234
          Job History:
          
          Company Name: Acme Corp
          Role: Software Engineer
          Years: 5
          Company Name: Globex Inc.
          Role: Lead Developer
          Years: 3
          Skills:
          
          Programming
          Leadership
          Communication`
        }
      ],
      tool_choice: {
        type: "function",
        function: {
          name: "process_user_data"
        }
      },
      tools: [
        {
          type: "function",
          function: {
            name: "process_user_data",
            description: "Processes user data, including personal and professional details.",
            parameters: {
              type: "object",
              properties: {
                userDetails: {
                  type: "object",
                  properties: {
                    firstName: {
                      type: "string"
                    },
                    lastName: {
                      type: "string"
                    },
                    contactDetails: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string"
                        },
                        phoneNumber: {
                          type: "string"
                        }
                      },
                      required: ["email"]
                    }
                  },
                  required: ["firstName", "lastName", "contactDetails"]
                },
                jobHistory: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      companyName: {
                        type: "string"
                      },
                      role: {
                        type: "string"
                      },
                      years: {
                        type: "number"
                      }
                    },
                    required: ["companyName", "role"]
                  }
                },
                skills: {
                  type: "array",
                  items: {
                    type: "string"
                  }
                }
              },
              required: ["userDetails", "jobHistory"],
              additionalProperties: false
            }
          }
        }
      ]
    })

    let final = {}
    for await (const data of completion) {
      final = data
      console.log(JSON.stringify(final, null, 2))
    }

    console.log(JSON.stringify(final, null, 2), "final final")
    expect(final).toBeDefined()
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

    let final: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta.ToolCall[] = []
    for await (const data of completion) {
      if (data?.choices?.[0]?.delta.tool_calls) {
        final = data?.choices?.[0]?.delta.tool_calls
      }
    }

    expect(final).toEqual([
      {
        index: 0,
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
