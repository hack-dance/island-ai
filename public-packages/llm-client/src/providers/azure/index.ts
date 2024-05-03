import { 
  OpenAIClient as AzureClient, 
  OpenAIKeyCredential, 
  AzureKeyCredential
} from "@azure/openai";
import { omit } from "@/lib"
import { 
  LLMClientCreateParams, 
  AzureAuthenticationOptions 
} from "@/types"

/**
 * Represents an wrapper around the OpenAIClient from the Azure OpenAI JS
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
    const openAiApiKey = p.opts?.apiKey ?? process.env?.OPENAI_API_KEY ?? null
    const azureApiKey = p.opts?.apiKey ?? process.env?.AZURE_API_KEY ?? null
    const endpoint = p.opts?.endpoint ?? process.env?.AZURE_ENDPOINT ?? null

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
    params: ExtendedChatCompletionParams
  ): {
    return this.transformParamsRegular(params);
  }

  private transformParamsRegular(
    params: ExtendedChatCompletionParams
  ): AzureChatCompletionParams {
    return {
      deploymentName: params.model 
      message: params.messages
      options: params.options
    }
  }

  private transformResponse(
    response: AzureClient.ChatCompletions
  ): ExtendedChatCompletion {
    choices = this.transformResponseChoices(response.choices)
    usage = this.transformResponseUsage(response.usage ?? null)

    return {
      id: response.id,
      choices: choices,
      created: Math.floor(response.getTime() / 1000),
      model: response.model,
      object: OpenAI.ChatCompletion["object"], // Static value it seems
      system_fingerprint: response.systemFingerprint ?? null 
      usage: usage,
      originResponse: response
    }
  }

  /**
   * TODO: Purpose statement
   */
  private transformResponseChoices(
    choices: AzureClient.ChatChoice
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

  /**
   * TODO: Purpose statement
   */
  private transformResponseUsage(
    usage: AzureClient.CompletionsUsage | null
  ): OpenAI.CompletionUsage {
    return usage ? {
      completion_tokens: response.usage.completionTokens,
      prompt_tokens: response.usage.promptTokens,
      total_tokens: response.usage.totalTokens
    } : null
  }

  // TODO: Purpose statement + figure out types
  private async abstract *transformResultingStream(
      responseStream: P
  ): AsyncIterable<OpenAI.ChatCompletionChunk> {
    let transformedResponse: AzureClient.ChatCompletions | null = null

    // Let's assume there is only one choice for now ?
    for await (const response of responseStream) {
      const delta = response.choices[0].delta?.content

      if (delta !== undefined) {
        response.choices[0].message = delta
        transformedResponse = this.transformResponse(response)

        // This omission should probably be in a transformResponseChunk function
        yield omit(transformedResponse, "usage") as OpenAi.ChatCompletionChunk
      }
    }
  }

  // TODO: Purpose statement + figure out types
  private async clientStreamChatCompletions(providerParams: P): AsyncIterable<Q> {
    let result: AzureClient.EventStream<AzureClient.ChatCompletions>;
    result = await this.client.streamChatCompletions(
      params.deploymentName,
      azureParams.messages,
      azureParams.options
    )

    return result
  }

  // TODO: Purpose statement + figure out types
  private async clientChatCompletions(
    providerParams: AzureChatCompletionParams
  ): Promise<> {
    const result = await this.client.getChatCompletions(
      params.deploymentName,
      azureParams.messages,
      azureParams.options
    )

    return result
  }
}
