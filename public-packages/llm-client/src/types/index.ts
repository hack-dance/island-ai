import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"

export type Providers = "openai" | "anthropic" | "google"

export type LogLevel = "debug" | "info" | "warn" | "error"

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

/** Google types */
export type GoogleChatCompletionParamsStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "messages"
> & {
  messages: SupportedChatCompletionMessageParam[]
  stream: true
  max_tokens: number
}

export type GoogleChatCompletionParamsNonStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "messages"
> & {
  messages: SupportedChatCompletionMessageParam[]
  stream?: false | undefined
  max_tokens: number
}

export type GoogleChatCompletionParams =
  | GoogleChatCompletionParamsStream
  | GoogleChatCompletionParamsNonStream

/** General type for providers */
export type OpenAILikeClient<P> = P extends "openai" | "azure"
  ? OpenAI
  : P extends "google"
    ? GoogleGenerativeAI & {
        chat: {
          completions: {
            create: unknown
          }
        }
      }
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
