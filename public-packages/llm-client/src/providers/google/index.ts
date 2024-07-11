import { LogLevel, OpenAILikeClient } from "@/types"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ClientOptions } from "openai"

type ChatMessageType = {
  role: string
  content: string
}

type CompletionsCreateParams = {
  model: string
  messages: ChatMessageType[]
  stream?: boolean
}

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

  public async create(params: CompletionsCreateParams) {
    try {
      console.log({ params })

      const generativeModel = this.getGenerativeModel({ model: params?.model })

      if (params?.stream) {
        const result = await generativeModel.generateContentStream(params?.messages?.[0]?.content)
        // Print text as it comes in.
        for await (const chunk of result.stream) {
          const chunkText = chunk.text()
          console.log(chunkText)
        }
        return result
      } else {
        const result = await generativeModel.generateContent(params?.messages?.[0]?.content)
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
