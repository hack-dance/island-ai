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

  private transformParamsStream(
    params: P
  ): {
    return this.transformParamsRegular(params);
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

    // TODO: Add the original response here
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
  private async clientChatCompletions(providerParams: P): Q {
    const result = await this.client.getChatCompletions(
      params.deploymentName,
      azureParams.messages,
      azureParams.options
    )

    return result
  }
}
