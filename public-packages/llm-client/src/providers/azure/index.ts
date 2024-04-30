import OpenAIClient as AzureClient from "@azure/openai";

export type LogLevel = "debug" | "info" | "warn" | "error"

// TODO: Purpose statement
export class AzureProvider extends AzureClient implements OpenAILikeClient<"azure"> {
    public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? 

    // TODO: Purpose statement
    constructor() {
        const baseURL = opts?.apiKey ?? process.env?.["AZURE_OPENAI_RESOURCE"] ?? ""
        const apiKey = opts?.apiKey ?? process.env?.["AZURE_API_KEY"] ?? null

        if (!apiKey) {
            // TODO: Error message that states only authentication 
            // with key credential is required
            throw new Error()
        }

        // TODO: Figure out how to map this to the Azure client constructor
        if (baseURL) {
        } else {
        }

        this.logLevel = opts?.logLevel ?? this.logLevel
    }

    // TODO: Abstract logging
    
    [key: string]: unknown
}
