import { LLMClient } from "@/index"
import Instructor from "@instructor-ai/instructor"
import z from "zod"

const anthropicClient = new LLMClient({
  provider: "anthropic"
})

anthropicClient

const instructor = Instructor({
  client: anthropicClient,
  debug: true,
  mode: "MD_JSON"
})

const complete = await instructor.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  stream: true,
  response_model: {
    schema: z.object({
      response: z.string()
    }),
    name: "response"
  },
  messages: [
    {
      role: "user",
      content: "hey how are you"
    }
  ]
})

// console.log(complete)

for await (const data of complete) {
  console.clear()
  console.log(data)
}
