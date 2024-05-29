import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { 
  OpenAIClient as AzureClient,
  ChatCompletionsToolDefinitionUnion as AzureChatCompletionTool
  ChatCompletionsToolSelectionPresent,
  ChatCompletionsNamedToolSelectionUnion,
  ChatRequestMessageUnion,
  ChatCompletion,
  GetChatCompletionOptions
} from "@azure/openai"

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

export type AnthropicExtendedChatCompletionParamsStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages" | "tools" | "tool_choice"
> & {
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream: true
  // TODO: Why is this necessary
  max_tokens: number
  tools?: undefined
  tool_choice?: undefined
}

export type AnthropicExtendedChatCompletionParamsNonStream = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages"
> & {
  model: Anthropic.CompletionCreateParams["model"]
  messages: SupportedChatCompletionMessageParam[]
  stream?: false | undefined
  max_tokens: number
}

export type AnthropicExtendedChatCompletionParams =
  | AnthropicExtendedChatCompletionParamsStream
  | AnthropicExtendedChatCompletionParamsNonStream

export type AnthropicChatCompletionParams = Anthropic.Beta.Tools.Messages.MessageCreateParamsNonStreaming

export type AnthropicChatCompletion = 
  | Anthropic.Messages.Message
  | Anthropic.Beta.Tools.Messages.ToolsBetsMessage

export type AnthropicExtendedChatCompletion = Partial<OpenAI.ChatCompletion> & {
  originResponse: AnthropicChatCompletion
}

export type AnthropicExtendedChatCompletionChunk = Partial<OpenAI.ChatCompletionChunk> & {
  originResponse: AnthropicChatCompletion
}

export type AnthropicChatCompletionStreamingParams = Anthropic.Messages.MessageCreateParamsStreaming


export type AnthropicChatCompletionChunk = Anthropic.MessageStreamEvent

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

type AzureChatCompletionToolChoice = 
  | ChatCompletionsToolSelectionPreset 
  | ChatCompletionsNamedToolSelectionUnion

export type AzureExtendedChatCompletionParams = Omit<
  Partial<OpenAI.ChatCompletionCreateParams>,
  "model" | "messages" | "tools" | "tool_choice"
> & {
  model: string
  messages: ChatRequestMessageUnion[]
  tools?: AzureChatCompletionTool[]
  tool_choice?: AzureChatCompletionToolChoice
}

export type AzureChatCompletionParams = {
  deploymentName: string
  messages: ChatRequestMessageUnion[]
  options: Omit<GetChatCompletionsOptions, "azureExtensionOptions">
}

export type AzureChatCompletion = ChatCompletion 

export type AzureExtendedChatCompletion = Partial<OpenAI.ChatCompletion> & {
  originResposne: AzureChatCompletion
}

export type AzureExtendedChatCompletionChunk = Partial<OpenAI.ChatCompletionChunk> & {
  originResponse: AzureChatCompletion
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
  | AnthropicExtendedChatCompletionParams 
  | AzureExtendedChatCompletionParams

export type ProviderChatCompletionParams = 
  | AnthropicChatCompletionParams
  | AzureChatCompletionParams 

export type ProviderChatCompletionStreamingParams = 
  | AnthropicChatCompletionStreamingParams
  | AzureChatCompletionParams

export type ProviderChatCompletion =
  | AnthropicChatCompletion
  | AzureChatCompletion

// TODO: The supposed ProviderChatCompletionStream is
// an AsyncIterable<ProviderChatCompletionChunk>. Should
// that be declared explicitly ?

export type ProviderChatCompletionChunk = 
  | AnthropicChatCompletionChunk
  | AzureChatCompletion

export type ExtendedChatCompletion = Promise<
  | AnthropicExtendedChatCompletion
  | AzureExtendedChatCompletion
>

export type ExtendedChatCompletionChunk = Promise<
  | AnthropicExtendedChatCompletionChunk
  | AzureExtendedChatCompletionChunk
>

export type OpenAILikeClient<P extends SupportedProvider> = P extends "openai"
  ? OpenAI
  : {
    chat: {
      completions: {
        create: <P extends ExtendedChatCompletionParams>(
          params: P
        ) => P extends { stream: true }
        ? Promise<AsyncIterable<ExtendedChatCompletionChunk>>
        : ExtendedChatCompletion
      }
    }
  }
