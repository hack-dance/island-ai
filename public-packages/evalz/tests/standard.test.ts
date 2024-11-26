import { createEvaluator } from "@/evaluators"
import { createWeightedEvaluator } from "@/evaluators/weighted"
import { createAccuracyEvaluator, createContextEvaluator } from "@/index"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"

import { accuracyData, contextData, data } from "./data"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
})

const relevanceEval = () =>
  createEvaluator({
    client: oai,
    model: "gpt-4o",
    evaluationDescription:
      "Please rate the relevance of the response from 0 (not at all relevant) to 1 (highly relevant), considering whether the AI stayed on topic and provided a reasonable answer."
  })

const distanceEval = () =>
  createAccuracyEvaluator({
    weights: { factual: 1.0, semantic: 0.0 }
  })

const semanticEval = () =>
  createAccuracyEvaluator({
    weights: { factual: 0.0, semantic: 1.0 }
  })

const fluencyEval = () =>
  createEvaluator({
    client: oai,
    model: "gpt-4o",
    evaluationDescription:
      "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."
  })

const completenessEval = () =>
  createEvaluator({
    client: oai,
    model: "gpt-4o",
    evaluationDescription:
      "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."
  })

const contextEntitiesRecallEval = () => createContextEvaluator({ type: "entities-recall" })
const contextPrecisionEval = () => createContextEvaluator({ type: "precision" })
const contextRecallEval = () => createContextEvaluator({ type: "recall" })
const contextRelevanceEval = () => createContextEvaluator({ type: "relevance" })

describe("Should eval", () => {
  test("Basic relevance eval", async () => {
    const evaluator = relevanceEval()

    const result = await evaluator({
      data: data
    })

    console.log(result)

    //@ts-ignore
    expect(result.scoreResults.value).toBeGreaterThanOrEqual(0.9)
  })
})

test("Accuracy - distance", async () => {
  const evaluator = distanceEval()

  const result = await evaluator({
    data: accuracyData
  })

  console.log(result, "distance results")

  expect(result.scoreResults.value).toBeGreaterThan(0.35)
})

test("Accuracy - semantic", async () => {
  const evaluator = semanticEval()

  const result = await evaluator({
    data: accuracyData
  })

  console.log(result, "semantic results")

  expect(result.scoreResults.value).toBeGreaterThan(0.8)
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

describe("Context Evaluators", () => {
  test("Context Entities Recall", async () => {
    const evaluator = contextEntitiesRecallEval()

    const result = await evaluator({
      data: contextData
    })

    console.log(result, "entities recall results")

    expect(result.scoreResults.value).toBeGreaterThan(0.5)
  })

  test("Context Precision", async () => {
    const evaluator = contextPrecisionEval()

    const result = await evaluator({
      data: contextData
    })

    console.log(result, "precision results")

    expect(result.scoreResults.value).toBeGreaterThan(0.5)
  })

  test("Context Recall", async () => {
    const evaluator = contextRecallEval()

    const result = await evaluator({
      data: contextData
    })

    console.log(result, "recall results")

    expect(result.scoreResults.value).toBeGreaterThanOrEqual(0.5)
  })

  test("Context Relevance", async () => {
    const evaluator = contextRelevanceEval()

    const result = await evaluator({
      data: contextData
    })

    console.log(result, "relevance results")

    expect(result.scoreResults.value).toBeGreaterThan(0.5)
  })
})

describe("Composite Evaluators", () => {
  test("Composite Evaluator", async () => {
    const compositeEvaluator = createWeightedEvaluator({
      evaluators: {
        relevance: relevanceEval(),
        fluency: fluencyEval(),
        completeness: completenessEval(),
        accuracy: createAccuracyEvaluator({
          weights: { factual: 0.6, semantic: 0.4 }
        }),
        contextPrecision: contextPrecisionEval()
      },
      weights: {
        relevance: 0.2,
        fluency: 0.2,
        completeness: 0.2,
        accuracy: 0.2,
        contextPrecision: 0.2
      }
    })

    const result = await compositeEvaluator({
      data: [...contextData, ...accuracyData, ...data]
    })

    console.log(result.scoreResults)

    expect(result.scoreResults.value).toBeGreaterThan(0.45)
  })
})
