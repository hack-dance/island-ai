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

const completion2 = await googleClient.chat.completions.create({
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

console.log(JSON.stringify(completion2, null, 2))
