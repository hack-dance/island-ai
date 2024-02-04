import { createEvaluator } from "@/evaluators"
import { omit } from "@/lib"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"

import { data } from "./data"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
})

describe("Should eval", () => {
  test("Basic relevance eval", async () => {
    const evaluationDescription =
      "Please rate the relevance of the response from 0 (not at all relevant) to 1 (highly relevant), considering whether the AI stayed on topic and provided a reasonable answer."

    const evaluator = createEvaluator({
      client: oai,
      model: "gpt-4-1106-preview",
      evaluationDescription
    })

    const result = await evaluator({
      data: data
    })

    expect(omit(["results"], result)).toEqual({
      scoreResults: {
        value: 1
      }
    })
  })
})
