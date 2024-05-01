import { OpenAIClient as AzureClient } from "@azure/openai";

// TODO: Purpose statement
export class AzureProvider extends BaseProvider<"azure"> {
  // TODO: Purpose statement
  constructor(opts: ClientOpts) {
    super({
      apiKeyEnvVar: "AZURE_API_KEY",
      providerName: "azure",
      logLevel: opts?.logLevel ?? null
    })
  }

  [key: string]: unknown

  private createClient(): AzureClient {
    // TODO: Figure out authentication
    return new AzureClient()
  }

  private transformParamsRegular(
    params: P
  ): AzureChatCompletionCreateParamsNonStreaming {
    return {
      deploymentName: params.model 
      message: params.messages as AzureClient.ChatRequestMessageUnion[],
      options: params.options as Omit<AzureClient.GetChatCompletionOptions, "azureExtensionOptions">
    }
  }

  private transformResponse(response: AzureClient.ChatCompletions): OpenAI.ChatCompletion {
    choices = this.transformResponseChoices(response.choices)
    usage = this.transformResponseUsage(response.usage ?? null)

    return {
      id: response.id,
      choices: choices,
      created: Math.floor(response.getTime() / 1000),
      // TODO: The model parameter of the response type will have to be omitted
      // in the same way it's done for the request type
      model: response.model,
      object: OpenAI.ChatCompletion["object"], // Static value it seems
      system_fingerprint: response.systemFingerprint ?? null 
      usage: usage
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

  public async create(
    params: P
  ): Q {
    try {
      if (params.stream) {
        const azureParams = this.transformParamsStream(params)
        // TODO: Streaming chat completion
      } else {
        const azureParams = this.transformParamsRegular(params)
        const result = await this.client.getChatCompletions(
          azureParams.deploymentName, // Model name
          azureParams.messages,
          azureParams.options
        )
        const transformedResult = await = this.transformResponse(result)

        return transformedResult // TODO: Type cast this appropriately
      }
    } catch (error) {
      console.error(`Error in ${this.name} API request:`, error)
    }
  }
}
