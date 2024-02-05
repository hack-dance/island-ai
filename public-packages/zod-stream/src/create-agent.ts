import OpenAI from "openai"
import { z } from "zod"

import { OAIResponseParser } from "./oai/parser"
import { OAIStream } from "./oai/stream"
import { withResponseModel } from "./response-model"
import { Mode } from "./types"

export type CreateAgentParams = {
  defaultClientOptions: Partial<OpenAI.ChatCompletionCreateParams> & {
    model: OpenAI.ChatCompletionCreateParams["model"]
    messages: OpenAI.ChatCompletionMessageParam[]
  }
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

/**
 * Create a pre-configured "agent" that can be used to generate completions
 * Messages that are passed at initialization will be pre-pended to all completions
 * all other configuration can be overriden in the completion call.
 *
 * @param {CreateAgentParams} params
 *
 * @returns {AgentInstance}
 */
export function createAgent({
  defaultClientOptions,
  response_model,
  mode = "TOOLS",
  client
}: CreateAgentParams) {
  const defaultAgentParams = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...defaultClientOptions
  }

  if (!client) {
    throw new Error("an OpenAI-like client is required")
  }

  const oai = client

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
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride?.messages ?? [])
      ] as OpenAI.ChatCompletionMessageParam[]

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
    },
    /**
     * Generate a standard completion
     * @param {ConfigOverride}
     *
     * @returns {Promise<z.infer<typeof response_model.schema>> }
     */
    completion: async (
      configOverride: ConfigOverride
    ): Promise<z.infer<typeof response_model.schema>> => {
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride?.messages ?? [])
      ] as OpenAI.ChatCompletionMessageParam[]

      const params = withResponseModel({
        mode,
        response_model,
        params: {
          ...defaultAgentParams,
          ...configOverride,
          stream: false,
          messages
        }
      })

      const res = await oai.chat.completions.create(params)
      const extractedResponse = OAIResponseParser(res)

      return JSON.parse(extractedResponse)
    }
  }
}
