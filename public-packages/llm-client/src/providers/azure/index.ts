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

  private abstract createClient(): AzureClient {
    // TODO: Figure out authentication
    return new AzureClient()
  }

  private abstract transformParamsRegular(
    params: P
  ): AzureChatCompletionCreateParamsNonStreaming {
    return {
      deploymentName: params.model 
      message: params.messages as AzureClient.ChatRequestMessageUnion[],
      options: params.options as Omit<AzureClient.GetChatCompletionOptions, "azureExtensionOptions">
    }
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
