import { GoogleChatCompletionParams, LogLevel, OpenAILikeClient } from "@/types"
import {
  Content,
  GenerateContentRequest,
  GoogleGenerativeAI,
  TextPart
} from "@google/generative-ai"
import { ClientOptions } from "openai"

export class GoogleProvider extends GoogleGenerativeAI implements OpenAILikeClient<"google"> {
  public apiKey: string
  public logLevel: LogLevel = (process.env?.["LOG_LEVEL"] as LogLevel) ?? "info"

  constructor(
    opts?: ClientOptions & {
      logLevel?: LogLevel
    }
  ) {
    const apiKey = opts?.apiKey ?? process.env?.["GOOGLE_API_KEY"] ?? null

    if (!apiKey) {
      throw new Error(
        "API key is required for GoogleProvider - please provide it in the constructor or set it as an environment variable named GEMINI_API_KEY."
      )
    }

    super(apiKey)

    this.logLevel = opts?.logLevel ?? this.logLevel
    this.apiKey = apiKey
  }

  /**
   * Transforms the OpenAI chat completion parameters into Google chat completion parameters.
   * @param params - The OpenAI chat completion parameters.
   * @returns The transformed Google chat completion parameters.
   */
  private transformParams(params: GoogleChatCompletionParams): GenerateContentRequest {
    // borrowed from Anthropic
    // const systemMessages = params.messages.filter(message => message.role === "system")
    // const system = systemMessages?.length
    //   ? systemMessages.map(message => message.content).join("\n")
    //   : ""

    // if (systemMessages.length) {
    //   console.warn(
    //     "Google does not support system messages - concatenating them all into a single 'system' property."
    //   )
    // }

    // conform messages to Google's Content[] type
    // they use "model" and "user" instead of "assistant" and "user", and also have no "system" role
    const contents: Content[] = params.messages
      .filter(message => message.role !== "system")
      .map(message => {
        const textPart: TextPart = {
          text: message.content.toString()
        }
        return {
          role: message.role === "assistant" ? "model" : "user",
          parts: [textPart]
        }
      })

    return {
      contents
    }
  }

  public async create(params: GoogleChatCompletionParams) {
    try {
      console.log({ params })

      if (!params?.model || !params?.messages?.length) {
        throw new Error("model and messages are required")
      }

      const googleParams = this.transformParams(params)

      const generativeModel = this.getGenerativeModel({ model: params?.model })

      if (params?.stream) {
        const result = await generativeModel.generateContentStream(googleParams)
        for await (const chunk of result.stream) {
          const chunkText = chunk.text()
          console.log(chunkText)
        }
        return result
      } else {
        const result = await generativeModel.generateContent(googleParams)
        const response = result.response
        const text = response.text()
        console.log(text)
        return text
      }
    } catch (error) {
      console.error("Error in Google API request:", error)
      throw error
    }
  }

  public chat = {
    completions: {
      create: this.create.bind(this)
    }
  }
}
