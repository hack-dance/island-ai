import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

// TODO: Do we want this to be an enum instead to avoid referencing strings
// all over the place ?
export type Providers = "openai" | "anthropic" | "azure"

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
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream?: false | undefined
  max_tokens: number
}

export type AnthropicChatCompletionParams =
  | AnthropicChatCompletionParamsStream
  | AnthropicChatCompletionParamsNonStream

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
