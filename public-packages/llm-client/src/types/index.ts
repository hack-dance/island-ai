import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

export type Providers = "openai" | "anthropic"

type SupportedChatCompletionMessageParam = Omit<
  OpenAI.ChatCompletionCreateParams["messages"][number],
  "content"
> & {
  content:
    | string
    | (
        | Anthropic.Messages.TextBlockParam
        | Anthropic.Messages.ImageBlockParam
        | Anthropic.Messages.ToolUseBlockParam
        | Anthropic.Messages.ToolResultBlockParam
      )[]
}

export type ExtendedCompletionAnthropic = Partial<OpenAI.ChatCompletion> & {
  originResponse: Anthropic.Messages.Message | Anthropic.Messages.ToolResultBlockParam
}

export type ExtendedCompletionChunkAnthropic = Partial<OpenAI.ChatCompletionChunk> & {
  originResponse: Anthropic.Messages.Message | Anthropic.Messages.ToolResultBlockParam
}

export type AnthropicChatCompletionParamsStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages"
> & {
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream: true
  max_tokens: number
}

export type AnthropicChatCompletionParamsNonStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages"
> & {
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream?: false | undefined
  max_tokens: number
}

export type AnthropicChatCompletionParams =
  | AnthropicChatCompletionParamsStream
  | AnthropicChatCompletionParamsNonStream

export type OpenAILikeClient<P> = P extends "openai"
  ? OpenAI
  : P extends "anthropic"
    ? Anthropic & {
        [key: string]: unknown
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
