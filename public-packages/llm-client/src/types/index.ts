import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { OpenAIClient as AzureClient } from "@azure/openai"

export type LogLevel = "debug" | "info" | "warn" | "error"

export type SupportedProvider = "openai" | "anthropic" | "azure"

export type ProviderClient = OpenAI | Anthropic | AzureClient

//   ___   _   _ _____ _   _ ______ ___________ _____ _____ 
//  / _ \ | \ | |_   _| | | || ___ \  _  | ___ \_   _/  __ \
// / /_\ \|  \| | | | | |_| || |_/ / | | | |_/ / | | | /  \/
// |  _  || . ` | | | |  _  ||    /| | | |  __/  | | | |    
// | | | || |\  | | | | | | || |\ \\ \_/ / |    _| |_| \__/\
// \_| |_/\_| \_/ \_/ \_| |_/\_| \_|\___/\_|    \___/ \____/

export type AnthropicApiKey = {
  anthropicApiKey: string
}

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

export type AnthropicChatCompletion = 
  | Anthropic.Messages.Message
  | Anthropic.Beta.Tools.Messages.ToolsBetsMessage

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

//     ___ _____   __  ______  ______
//    /   /__  /  / / / / __ \/ ____/
//   / /| | / /  / / / / /_/ / __/   
//  / ___ |/ /__/ /_/ / _, _/ /___   
// /_/  |_/____/\____/_/ |_/_____/

export type OpenAIApiKey = {
  openAiApiKey: string
}

export type AzureApiKey = {
  endpoint: string
  azureApiKey: string
}

// TODO: Does not support Azure Active Directory authentication
export type AzureAuthenticationOptions = OpenAIAPIKey | AzureApiKey

export type AzureExtendedChatCompletionParams = undefined

export type AzureChatCompletionParams = {
  deploymenetName: string
  messages: AzureClient.ChatRequestMessageUnion[]
  options: Omit<AzureCleint.GetChatCompletionsOptions, "azureExtensionOptions">
}

export type AzureChatCompletion = Promise<AzureClient.ChatCompletions>

export type AzureExtendedChatCompletion = Partial<OpenAI.ChatCompletion> & {
  originResposne: AzureClient.ChatCompletions
}

//  _____ ________  _________ _____ _   _  ___________ 
// /  __ \  _  |  \/  || ___ \_   _| \ | ||  ___|  _  \
// | /  \/ | | | .  . || |_/ / | | |  \| || |__ | | | |
// | |   | | | | |\/| || ___ \ | | | . ` ||  __|| | | |
// | \__/\ \_/ / |  | || |_/ /_| |_| |\  || |___| |/ / 
//  \____/\___/\_|  |_/\____/ \___/\_| \_/\____/|___/

export type AuthenticationOptions = 
  | OpenAIAPIKey 
  | AnthropicApiKey
  | AzureAuthenticationOptions

export type ExtendedChatCompletionParams = 
  | AnthropicChatCompletionParams
  | AzureExtendedChatCompletionParams

export type ProviderChatCompletionParams = 
  | AnthropicFooBar
  | AzureChatCompletionParams 

export type ProviderChatCompletionStreamingParams = 
  | AnthropicFooBar
  | AzureChatCompletionParams

export type ProviderChatCompletion =
  | AnthropicChatCompletion
  | AzureChatCompletion

export type ProviderChatCompletionChunk = 
  | AnthropicFooBar
  | AzureChatCompletionChunk

export type ExtendedChatCompletion = 
  | AnthropicExtendedChatCompletion
  | AzureExtendedChatCompletion

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
