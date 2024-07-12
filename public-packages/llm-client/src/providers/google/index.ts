import {
  ExtendedCompletionGoogle,
  GoogleChatCompletionParams,
  LogLevel,
  OpenAILikeClient
} from "@/types"
import {
  Content,
  FunctionCall,
  FunctionCallingMode,
  FunctionDeclarationsTool,
  GenerateContentRequest,
  GenerateContentResult,
  GoogleGenerativeAI,
  TextPart,
  Tool
} from "@google/generative-ai"
import OpenAI, { ClientOptions } from "openai"

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
    let function_declarations: FunctionDeclarationsTool[] = []

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

    if ("tools" in params && Array.isArray(params.tools) && params.tools.length > 0) {
      function_declarations = params.tools.map(
        tool =>
          ({
            name: tool.function.name ?? "",
            description: tool.function.description ?? "",
            parameters: tool.function.parameters
          }) as FunctionDeclarationsTool
      )
    }

    return {
      contents,
      tools: [{ function_declarations } as Tool],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.ANY,
          allowedFunctionNames: ["say_hello"]
        }
      }
    }
  }

  /**
   * Transforms the Google API response into an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   * @param result - The Anthropic API response.
   * @param stream - An optional parameter indicating whether the response is a stream.
   * @returns A Promise that resolves to an ExtendedCompletionAnthropic or ExtendedCompletionChunkAnthropic object.
   */
  private async transformResponse(
    result: GenerateContentResult,
    {
      stream,
      functionCalls,
      responseText
    }: { stream?: boolean; functionCalls?: FunctionCall[]; responseText?: string } = {}
  ): Promise<ExtendedCompletionGoogle> {
    const candidate = result.response?.candidates?.[0] // TODO: should we handle multiple candidates?
    console.log({ candidate })

    const transformedResponse = {
      //id: result.id,
      originResponse: result,
      //model: result.model,
      usage: {
        prompt_tokens: result.response.usageMetadata?.promptTokenCount ?? 0,
        completion_tokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
        total_tokens:
          (result.response.usageMetadata?.promptTokenCount ?? 0) +
          (result.response.usageMetadata?.candidatesTokenCount ?? 0)
      }
    }

    if (!stream) {
      const tool_calls = functionCalls?.map((block, index) => ({
        id: index,
        type: "function",
        function: {
          name: block.name,
          arguments: JSON.stringify(block.args)
        }
      }))

      return {
        ...transformedResponse,
        object: "chat.completion",
        choices: [
          {
            message: {
              role: "assistant",
              content: responseText,
              ...(tool_calls?.length ? { tool_calls } : {})
            },
            finish_reason: tool_calls?.length ? "tool_calls" : "stop",
            index: 0,
            logprobs: null
          } as OpenAI.ChatCompletion.Choice
        ]
      }
    }
    // TODO: handle streaming responses
  }

  public async create(params: GoogleChatCompletionParams) {
    try {
      console.log({ params })

      if (!params?.model || !params?.messages?.length) {
        throw new Error("model and messages are required")
      }

      const googleParams = this.transformParams(params)

      // console.log({ googleParams: Bun.inspect(googleParams) })

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
        const responseText = response.text()
        const functionCalls = response.functionCalls()
        // if (functionCalls && functionCalls.length) {
        //   console.log(JSON.stringify(functionCalls, null, 2))
        // }

        const transformedResult = await this.transformResponse(result, {
          stream: false,
          functionCalls,
          responseText
        })

        return transformedResult as ExtendedCompletionGoogle
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
