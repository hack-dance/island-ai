import type OpenAI from "openai"

/**
 * Parses non streaming responses that may contain both thinking sections and JSON content.
 * Handles incomplete JSON, and nested markdown blocks.
 * Includes thinking content in the returned object.
 *
 * @param data - The raw response data
 * @returns an object with json and thinking fields
 */
export function thinkingJsonParser(data: string | OpenAI.Chat.Completions.ChatCompletion): {
  json: string
  thinking: string
} {
  console.log("thinkingJsonParser", data)
  const text =
    typeof data === "string"
      ? data
      : "choices" in data && data.choices?.[0]
        ? data.choices[0].message?.content ?? ""
        : ""

  const thinkingRegex = /<think(?:ing)?>([\s\S]*?)(?:<\/think(?:ing)?>|\Z)/i
  const thinkingMatch = text.match(thinkingRegex)
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : ""

  const cleanText = text.replace(thinkingRegex, "").trim()

  if (cleanText.trim().startsWith("{") || cleanText.trim().startsWith("[")) {
    return { json: cleanText.trim(), thinking }
  }

  const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/
  const jsonMatch = cleanText.match(jsonRegex)

  if (jsonMatch) {
    const jsonStr = jsonMatch[1].trim()
    return { json: jsonStr, thinking }
  }

  const partialJsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*)/i)
  if (partialJsonMatch) {
    const partialContent = partialJsonMatch[1].trim()
    if (partialContent.startsWith("{") || partialContent.startsWith("[")) {
      return { json: partialContent, thinking }
    }
  }

  return { json: "", thinking }
}
