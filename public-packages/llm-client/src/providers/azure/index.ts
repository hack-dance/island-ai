import { OpenAILikeClient } from "@/types"
import { AzureOpenAI, type AzureClientOptions } from "openai"

const AZURE_OPENAI_API_VERSION_LATEST = "2024-08-01-preview"

export class AzureOpenAIProvider extends AzureOpenAI implements OpenAILikeClient<"azure-openai"> {
  constructor(opts?: AzureClientOptions) {
    const apiVersion = opts?.apiVersion ?? AZURE_OPENAI_API_VERSION_LATEST

    super({ ...opts, apiVersion })
  }
}
