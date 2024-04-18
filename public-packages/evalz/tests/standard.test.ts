import { createEvaluator } from "@/evaluators"
import { createWeightedEvaluator } from "@/evaluators/weighted"
import { omit } from "@/lib"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"

import { data } from "./data"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
})

function relevanceEval() {
  const evaluationDescription =
    "Please rate the relevance of the response from 0 (not at all relevant) to 1 (highly relevant), considering whether the AI stayed on topic and provided a reasonable answer."

  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription
  })
}

function fluencyEval() {
  const evaluationDescription =
    "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."

  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription
  })
}

function completenessEval() {
  const evaluationDescription =
    "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."

  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription
  })
}

describe("Should eval", () => {
  test("Basic relevance eval", async () => {
    const evaluator = relevanceEval()

    const result = await evaluator({
      data: data
    })

    console.log(result)

    expect(omit(["results"], result)).toEqual({
      scoreResults: {
        value: 1
      }
    })
  })
})

describe("Weighted eval", () => {
  test("Weighted", async () => {
    const evaluator = createWeightedEvaluator({
      evaluators: {
        relevance: relevanceEval(),
        fluency: fluencyEval(),
        completeness: completenessEval()
      },
      weights: {
        relevance: 0.25,
        fluency: 0.25,
        completeness: 0.5
      }
    })

    const result = await evaluator({
      data: data
    })

    console.log(result.scoreResults)

    expect(result.scoreResults.value).toBeGreaterThan(0.75)
  })
})
