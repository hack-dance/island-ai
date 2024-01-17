import { coreAgentSchema } from "@/schemas/core"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/index.mjs"
import { z } from "zod"
import { OAIStream, withResponseModel } from "zod-stream"

import { jsonToZod } from "@/lib/json-to-zod"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
})

export const runtime = "edge"

interface IRequest {
  messages: ChatCompletionMessageParam[]
  schema?: string
}

export async function POST(request: Request) {
  const { messages, schema } = (await request.json()) as IRequest

  let resolvedSchema: z.AnyZodObject = coreAgentSchema

  if (schema) {
    const potentialSchema = jsonToZod(schema)
    if (potentialSchema instanceof Error) {
      throw potentialSchema
    }

    resolvedSchema = potentialSchema
  }

  const params = withResponseModel({
    response_model: { schema: resolvedSchema, name: "Extract" },
    params: {
      messages,
      model: "gpt-4",
      stream: true
    },
    mode: "TOOLS"
  })

  const extractionStream = await oai.chat.completions.create(params)

  return new Response(
    OAIStream({
      res: extractionStream
    })
  )
}
