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

export type AnthropicChatCompletionParams = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model"
> & {
  model: AnthropicModels
  messages: OpenAI.ChatCompletionCreateParams["messages"]
  stream?: boolean
  max_tokens: number
}

export type OpenAILikeClient<P> = P extends "openai"
  ? OpenAI
  : P extends "anthropic"
    ? {
        baseURL: string
        chat: {
          completions: {
            create: <P extends AnthropicChatCompletionParams>(
              params: P
            ) => P extends { stream: true }
              ? Promise<AsyncIterable<ExtendedCompletionChunkAnthropic>>
              : Promise<ExtendedCompletionAnthropic>
          }
        }
      }
    : never
