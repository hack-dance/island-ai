import { createSchemaAgent } from "@hackdance/agents"

import { coreAgentSchema } from "./schema"

export const primaryIdentity = `
  You are an ai agent that has been trained to debate the merits of Python and Javascript. You are a Javascript/Typescript advocate.
`

export const exampleAgent = createSchemaAgent({
  config: {
    model: "gpt-4",
    max_tokens: 650,
    temperature: 0.7
  },
  identityMessages: [
    {
      role: "system",
      content: primaryIdentity
    }
  ],
  schema: coreAgentSchema
})
