import { createLLMClient } from "@/index"

const anthropicClient = createLLMClient({
  provider: "anthropic"
})

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

for await (const data of completion) {
  console.log(JSON.stringify(data, null, 2))
}
