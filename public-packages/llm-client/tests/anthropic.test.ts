import { createLLMClient } from "@/index"

const anthropicClient = createLLMClient({
  provider: "anthropic"
})

const complete = await anthropicClient.chat.completions.create({
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

for await (const data of complete) {
  console.clear()
  console.log(data)
}
