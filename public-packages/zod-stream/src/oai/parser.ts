import OpenAI from "openai"

/**
 * `OAIResponseFnArgsParser` parses a JSON string and extracts the function call arguments.
 *
 * @param {string} data - The JSON string to parse.
 * @returns {string} - The extracted function arguments.
 *
 */
export function OAIResponseFnArgsParser(
  data:
    | string
    | OpenAI.Chat.Completions.ChatCompletionChunk
    | OpenAI.Chat.Completions.ChatCompletion
): string {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data
  const text =
    parsedData.choices?.[0]?.delta?.function_call?.arguments ??
    parsedData.choices?.[0]?.message?.function_call?.arguments ??
    ""

  return text
}

/**
 * `OAIResponseToolArgsParser` parses a JSON string and extracts the tool call arguments.
 *
 * @param {string} data - The JSON string to parse.
 * @returns {Objstringect} - The extracted tool call arguments.
 *
 */
export function OAIResponseToolArgsParser(
  data:
    | string
    | OpenAI.Chat.Completions.ChatCompletionChunk
    | OpenAI.Chat.Completions.ChatCompletion
): string {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data

  const text =
    parsedData.choices?.[0]?.delta?.tool_calls?.[0]?.function?.arguments ??
    parsedData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
    ""

  return text
}

/**
 * `OAIResponseJSONParser` parses a JSON string and extracts the JSON content.
 *
 * @param {string} data - The JSON string to parse.
 * @returns {string} - The extracted JSON content.
 *
 *
 */
export function OAIResponseJSONParser(
  data:
    | string
    | OpenAI.Chat.Completions.ChatCompletionChunk
    | OpenAI.Chat.Completions.ChatCompletion
): string {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data
  const text =
    parsedData?.choices[0]?.message?.content ?? parsedData.choices?.[0].delta?.content ?? ""

  const jsonMdRegex = /```json\s*([\s\S]*?)\s*```/
  const plainJsonRegex = /{[\s\S]*}/

  let match = text.match(jsonMdRegex)
  if (match && match[1]) {
    return match[1].trim()
  } else {
    match = text.match(plainJsonRegex)
    if (match) {
      return match[0].trim()
    }
  }

  return text
}

/**
 * `OAIResponseParser` parses a JSON string or a response object.
 * It checks if the input contains function call arguments. If it does,
 * it uses `OAIResponseFnArgsParser` to parse the input, otherwise, it uses `OAIResponseTextParser`.
 *
 * @param {string | Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | OpenAI.Chat.Completions.ChatCompletion} data - The input to parse.
 * @returns {string} - The result of the appropriate parser.
 */

export function OAIResponseParser(
  data:
    | string
    | OpenAI.Chat.Completions.ChatCompletionChunk
    | OpenAI.Chat.Completions.ChatCompletion
): string {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data

  const isFnCall =
    parsedData.choices?.[0]?.delta?.function_call?.arguments ||
    parsedData.choices?.[0]?.message?.function_call?.arguments ||
    false

  const isToolCall =
    parsedData.choices?.[0]?.delta?.tool_calls?.[0]?.function?.arguments ??
    parsedData.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
    false

  if (isFnCall) {
    return OAIResponseFnArgsParser(data)
  }

  if (isToolCall) {
    return OAIResponseToolArgsParser(data)
  }

  return OAIResponseJSONParser(data)
}
