import { createLLMClient } from "@/index"

const googleClient = createLLMClient({
  provider: "google"
})

const completion = await googleClient.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [
    {
      role: "user",
      content: "How much does a soul weigh?"
    }
  ],
  max_tokens: 1000
})

console.log(JSON.stringify(completion, null, 2))
