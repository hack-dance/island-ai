import OpenAI from "openai"
import { z } from "zod"

import { OAIStream } from "./oai/stream"
import { withResponseModel } from "./response-model"
import { Mode } from "./types"

type CreateAgentParams = {
  config: OpenAI.ChatCompletionCreateParams
  /**
   * Mode to use
   * @default "TOOLS"
   *
   * @type {Mode}
   * */
  mode?: Mode
  /**
   * OpenAI client instance
   * @default new OpenAI()
   *
   * @type {OpenAI}
   * */
  client?: OpenAI
  response_model: {
    schema: z.AnyZodObject
    name: string
  }
}

export type AgentInstance = ReturnType<typeof createAgent>
export type ConfigOverride = Partial<OpenAI.ChatCompletionCreateParams>

function createDefaultOAI() {
  return new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
    organization: process.env["OPENAI_ORG_ID"]
  })
}

/**
 * Create a pre-configured "agent" that can be used to generate completions
 * Messages that are passed at initialization will be pre-pended to all completions
 * all other configuration can be overriden in the completion call.
 *
 * @param {CreateAgentParams} params
 *
 * @returns {AgentInstance}
 */
export function createAgent({ config, response_model, mode = "TOOLS", client }: CreateAgentParams) {
  const defaultAgentParams = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...config
  }

  const oai = client ?? createDefaultOAI()

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
