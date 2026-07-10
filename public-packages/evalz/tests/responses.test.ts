import { createEvaluator } from "@/evaluators"
import { describe, expect, mock, test } from "bun:test"
import OpenAI from "openai"

describe("Responses API evaluator", () => {
  test("uses structured Responses output and retries invalid results", async () => {
    const parse = mock()
      .mockResolvedValueOnce({ output_parsed: { score: "invalid" } })
      .mockResolvedValueOnce({ output_parsed: { score: 0.75 } })
    const client = {
      responses: { parse }
    } as unknown as OpenAI
    const evaluator = createEvaluator({
      client,
      evaluationDescription: "Score relevance from zero to one.",
      resultsType: "score"
    })

    const result = await evaluator({
      data: [{ prompt: "Hello", completion: "Hi there" }]
    })

    expect(result.scoreResults.value).toBe(0.75)
    expect(parse).toHaveBeenCalledTimes(2)
    expect(parse.mock.calls[0]?.[0]).toMatchObject({
      model: "gpt-5.6-luna",
      text: { format: { type: "json_schema", name: "Scoring", strict: true } }
    })
  })
})
