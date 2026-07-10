import type OpenAI from "openai"
import { z } from "zod"

import { OAIResponseParser } from "./oai/parser"
import { OAIStream } from "./oai/stream"
import { withResponseModel } from "./response-model"
import type { Mode } from "./types"

export type CreateAgentParams<T extends z.ZodObject> = {
  defaultClientOptions: Partial<OpenAI.ChatCompletionCreateParams> & {
    model: OpenAI.ChatCompletionCreateParams["model"]
    messages: OpenAI.ChatCompletionMessageParam[]
  }
  /** @default "TOOLS" */
  mode?: Mode
  client: OpenAI
  response_model: {
    schema: T
    name: string
    description?: string
  }
}

export type AgentInstance<T extends z.ZodObject> = ReturnType<typeof createAgent<T>>
export type ConfigOverride = Partial<OpenAI.ChatCompletionCreateParams>

/** Creates a pre-configured Chat Completions client with schema-aware response parsing. */
export function createAgent<T extends z.ZodObject>({
  defaultClientOptions,
  response_model,
  mode = "TOOLS",
  client
}: CreateAgentParams<T>) {
  const defaultAgentParams = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...defaultClientOptions
  }

  return {
    completionStream: async (
      configOverride: ConfigOverride = {}
    ): Promise<ReadableStream<Uint8Array>> => {
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride.messages ?? [])
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

      const extractionStream = await client.chat.completions.create(params)

      return OAIStream({ res: extractionStream })
    },
    completion: async (configOverride: ConfigOverride = {}): Promise<z.output<T>> => {
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride.messages ?? [])
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

      const response = await client.chat.completions.create(params)
      const extractedResponse = OAIResponseParser(response)
      const parsedResponse: unknown = JSON.parse(extractedResponse)

      return response_model.schema.parseAsync(parsedResponse)
    }
  }
}
