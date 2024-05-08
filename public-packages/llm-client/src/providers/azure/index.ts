import { BaseProvider } from "@/providers/base"
import { 
  OpenAIClient as AzureClient, 
  OpenAIKeyCredential, 
  AzureKeyCredential,
  ChatChoice,
  CompletionsUsage
} from "@azure/openai";
import { omit } from "@/lib"
import { 
  LLMClientCreateParams, 
  AzureAuthenticationOptions,
  ExtendedChatCompletionParams,
  AzureChatCompletionParams,
  AzureChatCompletion,
  AzureExtendedChatCompletion,
} from "@/types"
import { OpenAI } from "openai"

/**
 * Represents a wrapper around the OpenAIClient from the Azure OpenAI JS
 * client that can be interacted with using the OpenAI API
 */
export class AzureProvider extends BaseProvider<"azure"> {

  constructor(opts: LLMClientCreateParams) {
    super(opts)
  }

  [key: string]: unknown

  private createClient(
    authOpts: AzureAuthenticationOptions
  ): AzureClient {
    // TODO: Is the trailing `?? null` needed
    const openAiApiKey = authOpts?.openAiApiKey ?? process.env?.OPENAI_API_KEY ?? null
    const azureApiKey = authOpts?.azureApiKey ?? process.env?.AZURE_API_KEY ?? null
    const endpoint = authOpts?.endpoint ?? process.env?.AZURE_ENDPOINT ?? null

    if (openAiApiKey) {
      return new AzureClient(OpenAIKeyCredential(apiKey))
    } else if (azureApiKey && endpoint) {
      return new AzureClient(endpoint, new AzureKeyCredential(apiKey))
    } else {
      throw new Error(
        "Invalid authentication provided for Azure. Please \
see README for information on client authentication"
      )
    }
  }

  private transformParamsStream(
    params: AzureExtendedChatCompletionParams
  ): AzureChatCompletionParams {
    return this.transformParamsRegular(params);
  }

  private transformParamsRegular(
    params: AzureExtendedChatCompletionParams
  ): AzureChatCompletionParams {
    return {
      deploymentName: params.model,
      messages: params.messages,
      options: params.options
    }
  }

  private async transformResponse(
    response: AzureChatCompletion
  ): Promise<AzureExtendedChatCompletion> {
    choices = this.transformResponseChoices(response.choices)
    usage = this.transformResponseUsage(response.usage ?? null)

    return {
      id: response.id,
      choices: choices,
      created: Math.floor(response.getTime() / 1000),
      model: response.model,
      object: OpenAI.ChatCompletion["object"], // Static value it seems
      system_fingerprint: response.systemFingerprint ?? null,
      usage: usage,
      originResponse: response
    }
  }

  private transformResponseChoices(
    choices: ChatChoice
  ): OpenAI.ChatCompletion.Choice {
    return {
      finish_reason: choices.finishReason,
      index: choices.index,
      // TODO: Minor conversion required here
      logprobs: choices.logprobs,
      // TODO: Minor conversion required here + optional response parameter in Azure
      message: choices.message,
    }
  }

  private transformResponseUsage(
    usage: CompletionsUsage | null
  ): OpenAI.CompletionUsage {
    return usage ? {
      completion_tokens: response.usage.completionTokens,
      prompt_tokens: response.usage.promptTokens,
      total_tokens: response.usage.totalTokens
    } : null
  }

  private async *transformResultingStream(
    responseStream: AsyncIterable<AzureChatCompletion>
  ): AsyncIterable<AzureExtendedChatCompletion> {
    let transformedResponse: ChatCompletions | null = null

    // Let's assume there is only one choice for now ?
    for await (const response of responseStream) {
      const delta = response.choices[0].delta?.content

      if (delta !== undefined) {
        response.choices[0].message = delta
        transformedResponse = this.transformResponse(response)

        // TODO: This omission should probably be in a transformResponseChunk function
        yield omit(transformedResponse, "usage")
      }
    }
  }

  private async clientStreamChatCompletions(
    azureParams: AzureChatCompletionParams
  ): AsyncIterable<AzureChatCompletion> {
    const result = await this.client.streamChatCompletions(
      azureParams.deploymentName,
      azureParams.messages,
      azureParams.options
    )

    return result as AsyncIterable<AzureChatCompletion>
  }

  private async clientChatCompletions(
    azureParams: AzureChatCompletionParams
  ): AzureChatCompletion {
    const result = await this.client.getChatCompletions(
      azureParams.deploymentName,
      azureParams.messages,
      azureParams.options
    )

    return result
  }
}
