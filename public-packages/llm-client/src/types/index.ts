import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { OpenAIClient as AzureClient } from "@azure/openai"

export type LogLevel = "debug" | "info" | "warn" | "error"

export type SupportedProvider = "openai" | "anthropic" | "azure"

export type ProviderClient = OpenAI | Anthropic | AzureClient

// ANTHROPIC

type SupportedChatCompletionMessageParam = Omit<
  OpenAI.ChatCompletionCreateParams["messages"][number],
  "content"
> & {
  content:
    | string
    | (
        | Anthropic.Messages.TextBlockParam
        | Anthropic.Messages.ImageBlockParam
        | Anthropic.Beta.Tools.Messages.ToolUseBlockParam
        | Anthropic.Beta.Tools.Messages.ToolResultBlockParam
      )[]
}

export type ExtendedCompletionAnthropic = Partial<OpenAI.ChatCompletion> & {
  originResponse: Anthropic.Messages.Message | Anthropic.Beta.Tools.Messages.ToolsBetaMessage
}

export type ExtendedCompletionChunkAnthropic = Partial<OpenAI.ChatCompletionChunk> & {
  originResponse: Anthropic.Messages.Message | Anthropic.Beta.Tools.Messages.ToolsBetaMessage
}

export type AnthropicChatCompletionParamsStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages" | "tools" | "tool_choice"
> & {
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream: true
  max_tokens: number
  tools?: undefined
  tool_choice?: undefined
}

export type AnthropicChatCompletionParamsNonStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages"
> & {
  // TODO: The Completions API from Anthropic seems to be deprecated. I'm not even sure
  // how the sample test in Instructor passes since the claude-3 model is not supported by this
  // endpoint
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream?: false | undefined
  max_tokens: number
}

export type AnthropicChatCompletionParams =
  | AnthropicChatCompletionParamsStream
  | AnthropicChatCompletionParamsNonStream

// AZURE

// COMBINED

export type ExtendedChatCompletionParams = 
  | AnthropicChatCompletionParams
  | AzureChatCompletionParams

export type ProviderChatCompletionParams = undefined

export type ExtendedChatCompletion = 
  | AnthropicChatCompletion
  | AzureChatCompletion

// TODO: Update this type to include the Azure provider
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
