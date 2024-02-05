import { ResultsType } from "@/types"

export const CUSTOM_EVALUATOR_IDENTITY =
  "You are an AI evaluator tasked with scoring a language model's responses. You'll be presented with a 'prompt:' and 'response:' pair (and optionally an 'expectedResponse') and should evaluate based on the criteria provided in the subsequent system prompts. Provide only a numerical score in the range defined, not a descriptive response and no other prose."

export const RESPONSE_TYPE_EVALUATOR_SCORE =
  "Your task is to provide a numerical score ranging from 0 to 1 based on the criteria in the subsequent system prompts. The score should precisely reflect the performance of the language model's response. Do not provide any text explanation or feedback, only the numerical score."

export const RESPONSE_TYPE_EVALUATOR_BINARY =
  "Your task is to provide a binary score of either 0 or 1 based on the criteria in the subsequent system prompts. This should precisely reflect the language model's performance. Do not provide any text explanation or feedback, only a singular digit: 1 or 0."

export const RESULTS_TYPE_PROMPT: Record<ResultsType, string> = {
  score: RESPONSE_TYPE_EVALUATOR_SCORE,
  binary: RESPONSE_TYPE_EVALUATOR_BINARY
}
