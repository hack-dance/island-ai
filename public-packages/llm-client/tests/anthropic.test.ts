import { createLLMClient } from "@/index"
import { AnthropicModels } from "@/types"
import { describe, expect, test } from "bun:test"
import { z } from "zod"

import ZodStream, { OAIStream } from "../../zod-stream"

for await (const model of ["claude-3-opus-20240229", "claude-3-sonnet-20240229"] as const) {
  await createTestCase(model)
}

const anthropicClient = createLLMClient({
  provider: "anthropic",
  logLevel: "error"
})

async function createTestCase(model: AnthropicModels) {
  return new Promise<void>(resolve => {
    describe(`LLMClient Anthropic Provider - ${model}`, () => {
      // test("Function Calling standard", async () => {
      //   const completion = await anthropicClient.chat.completions.create({
      //     model,
      //     max_tokens: 1000,
      //     messages: [
      //       {
      //         role: "user",
      //         content: "My name is Dimitri Kennedy."
      //       }
      //     ],
      //     tool_choice: {
      //       type: "function",
      //       function: {
      //         name: "say_hello"
      //       }
      //     },
      //     tools: [
      //       {
      //         type: "function",
      //         function: {
      //           name: "say_hello",
      //           description: "Say hello",
      //           parameters: {
      //             type: "object",
      //             properties: {
      //               name: {
      //                 type: "string"
      //               }
      //             },
      //             required: ["name"],
      //             additionalProperties: false
      //           }
      //         }
      //       }
      //     ]
      //   })

      //   expect(completion?.choices?.[0]?.message.tool_calls).toEqual([
      //     {
      //       id: "0-say_hello",
      //       type: "function",
      //       function: {
      //         name: "say_hello",
      //         arguments: '{"name":"Dimitri Kennedy"}'
      //       }
      //     }
      //   ])
      // })

      // test("Function Calling complex schema", async () => {
      //   const completion = await anthropicClient.chat.completions.create({
      //     model,
      //     stream: true,
      //     max_tokens: 1000,
      //     messages: [
      //       {
      //         role: "user",
      //         content: `User Data Submission:

      //     First Name: John
      //     Last Name: Doe
      //     Contact Details:
      //     Email: john.doe@example.com
      //     Phone Number: 555-1234
      //     Job History:

      //     Company Name: Acme Corp
      //     Role: Software Engineer
      //     Years: 5
      //     Company Name: Globex Inc.
      //     Role: Lead Developer
      //     Years: 3
      //     Skills:

      //     Programming
      //     Leadership
      //     Communication`
      //       }
      //     ],
      //     tool_choice: {
      //       type: "function",
      //       function: {
      //         name: "process_user_data"
      //       }
      //     },
      //     tools: [
      //       {
      //         type: "function",
      //         function: {
      //           name: "process_user_data",
      //           description: "Processes user data, including personal and professional details.",
      //           parameters: {
      //             type: "object",
      //             properties: {
      //               story: {
      //                 type: "string",
      //                 description:
      //                   "The user's a minimum 500 word story made up story about the user - in valid markdown."
      //               },
      //               userDetails: {
      //                 type: "object",
      //                 properties: {
      //                   firstName: {
      //                     type: "string"
      //                   },
      //                   lastName: {
      //                     type: "string"
      //                   },
      //                   contactDetails: {
      //                     type: "object",
      //                     properties: {
      //                       email: {
      //                         type: "string"
      //                       },
      //                       phoneNumber: {
      //                         type: "string"
      //                       }
      //                     },
      //                     required: ["email"]
      //                   }
      //                 },
      //                 required: ["firstName", "lastName", "contactDetails"]
      //               },
      //               jobHistory: {
      //                 type: "array",
      //                 items: {
      //                   type: "object",
      //                   properties: {
      //                     companyName: {
      //                       type: "string"
      //                     },
      //                     role: {
      //                       type: "string"
      //                     },
      //                     years: {
      //                       type: "number"
      //                     }
      //                   },
      //                   required: ["companyName", "role"]
      //                 }
      //               },
      //               skills: {
      //                 type: "array",
      //                 items: {
      //                   type: "string"
      //                 }
      //               }
      //             },
      //             required: ["userDetails", "jobHistory"],
      //             additionalProperties: false
      //           }
      //         }
      //       }
      //     ]
      //   })

      //   let final = {} as ExtendedCompletionChunkAnthropic
      //   for await (const data of completion) {
      //     final = data
      //   }

      //   expect(final?.choices?.[0]?.delta.tool_calls).toBeDefined()
      // })

      // test("Function Calling stream", async () => {
      //   const completion = await anthropicClient.chat.completions.create({
      //     model,
      //     max_tokens: 1000,
      //     stream: true,
      //     messages: [
      //       {
      //         role: "user",
      //         content: "My name is Dimitri Kennedy."
      //       }
      //     ],
      //     tool_choice: {
      //       type: "function",
      //       function: {
      //         name: "say_hello"
      //       }
      //     },
      //     tools: [
      //       {
      //         type: "function",
      //         function: {
      //           name: "say_hello",
      //           description: "Say hello",
      //           parameters: {
      //             type: "object",
      //             properties: {
      //               name: {
      //                 type: "string"
      //               }
      //             },
      //             required: ["name"],
      //             additionalProperties: false
      //           }
      //         }
      //       }
      //     ]
      //   })

      //   let final = {} as ExtendedCompletionChunkAnthropic
      //   for await (const data of completion) {
      //     final = data
      //   }

      //   expect(final?.choices?.[0]?.delta.tool_calls).toEqual([
      //     {
      //       index: 0,
      //       function: {
      //         name: "say_hello",
      //         arguments: '{"name":"Dimitri Kennedy"}'
      //       }
      //     }
      //   ])
      // })

      // test("Standard completion", async () => {
      //   const completion = await anthropicClient.chat.completions.create({
      //     model,
      //     max_tokens: 1000,
      //     messages: [
      //       {
      //         role: "user",
      //         content: "hey how are you"
      //       }
      //     ]
      //   })

      //   expect(completion).toBeDefined()
      //   expect(completion?.choices?.[0].message.content).toBeDefined()
      // })

      // test("Stream completion", async () => {
      //   const completion = await anthropicClient.chat.completions.create({
      //     model,
      //     max_tokens: 1000,
      //     stream: true,
      //     messages: [
      //       {
      //         role: "user",
      //         content: "hey how are you"
      //       }
      //     ]
      //   })

      //   let final = ""

      //   for await (const data of completion) {
      //     final += data.choices?.[0]?.delta?.content ?? ""
      //   }

      //   expect(final.length).toBeGreaterThan(0)
      // })

      test("Zod stream ingest", async () => {
        const completion = await anthropicClient.chat.completions.create({
          model,
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

        const client = new ZodStream({ debug: true })

        const stream = await client.create({
          completionPromise: async () => {
            // @ts-expect-error the stream parser types still depend on OpenAI
            return OAIStream({ res: completion })
          },
          response_model: {
            schema: z.object({
              name: z.string()
            })
          }
        })

        let final = {}
        for await (const chunk of stream) {
          final = chunk
        }

        expect(final).toEqual({ name: "Dimitri Kennedy" })
      })
    })

    resolve()
  })
}
