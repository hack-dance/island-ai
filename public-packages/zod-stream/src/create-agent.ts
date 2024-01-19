import OpenAI from "openai"
import { z } from "zod"

import { OAIStream } from "./oai/stream"
import { withResponseModel } from "./response-model"
import { Mode } from "./types"

type CreateAgentParams = {
  config: OpenAI.ChatCompletionCreateParams
  mode?: Mode
  response_model: {
    schema: z.AnyZodObject
    name: string
  }
}

export type AgentInstance = ReturnType<typeof createAgent>
export type ConfigOverride = Partial<OpenAI.ChatCompletionCreateParams>

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
})

/**
 * Create a pre-configured "agent" that can be used to generate completions
 *
 * @param {CreateAgentParams} params
 *
 * @returns {AgentInstance}
 */
export function createAgent({ config, response_model, mode = "TOOLS" }: CreateAgentParams) {
  const defaultAgentParams = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...config
  }

  return {
    /**
     * Generate a single stream completion
     * @param {ConfigOverride}
     *
     * @returns {Promise<ReadableStream<Uint8Array>> }
     */
    completionStream: async (
      configOverride: ConfigOverride
    ): Promise<ReadableStream<Uint8Array>> => {
      const messages = [...(defaultAgentParams.messages ?? []), ...(configOverride?.messages ?? [])]

      const params = withResponseModel({
        mode,
        response_model,
        params: {
          ...defaultAgentParams,
          ...configOverride,
          stream: true,
          messages
        }
      })

      const extractionStream = await oai.chat.completions.create(params)

      return OAIStream({
        res: extractionStream
      })
    }
  }
}
