import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

export type Providers = "openai" | "anthropic"

export type ExtendedCompletionAnthropic = Partial<OpenAI.ChatCompletion> & {
  originResponse: Anthropic.Messages.Message
}

export type ExtendedCompletionChunkAnthropic = Partial<OpenAI.ChatCompletionChunk> & {
  originResponse: Anthropic.Messages.Message
}

export type AnthropicModels = "claude-3-opus-20240229" | "claude-3-sonnet-20240229"

export type OpenAILikeClient<P> = P extends "openai"
  ? OpenAI
  : P extends "anthropic"
    ? {
        baseURL: string
        chat: {
          completions: {
            create: (
              params: Omit<OpenAI.ChatCompletionCreateParams, "model"> & {
                model: AnthropicModels
                stream?: boolean
              }
            ) => Promise<
              | AsyncGenerator<ExtendedCompletionChunkAnthropic, void, undefined>
              | ExtendedCompletionAnthropic
            >
          }
        }
      }
    : never
