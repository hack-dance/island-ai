import { EvaluationResponse, Evaluator, ExecuteEvalParams, ResultsType } from "@/types"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import z from "zod"

import { CUSTOM_EVALUATOR_IDENTITY, RESULTS_TYPE_PROMPT } from "@/constants/prompts"

const scoringSchema = z.object({
  score: z.number()
})

export function createEvaluator<T extends ResultsType>({
  resultsType = "score" as T,
  evaluationDescription,
  model,
  messages,
  client
}: {
  resultsType?: T
  evaluationDescription: string
  model?: OpenAI.Model["id"]
  messages?: OpenAI.Responses.ResponseInput
  client: OpenAI
}): Evaluator<T> {
  if (!evaluationDescription || typeof evaluationDescription !== "string") {
    throw new Error("Evaluation description was not provided.")
  }

  const execute = async ({ data }: ExecuteEvalParams): Promise<EvaluationResponse<T>> => {
    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { prompt, completion, expectedCompletion } = item

        const input: OpenAI.Responses.ResponseInput = [
          {
            role: "system",
            content: CUSTOM_EVALUATOR_IDENTITY
          },
          {
            role: "system",
            content: RESULTS_TYPE_PROMPT[resultsType]
          },
          {
            role: "system",
            content: evaluationDescription
          },
          ...(messages ?? []),
          {
            role: "user",
            content: `prompt: ${prompt} \n completion: ${completion}\n  ${expectedCompletion?.length ? `expectedCompletion: ${expectedCompletion}\n` : " "}Please provide your score now:`
          }
        ]

        let score: number | undefined
        let lastError: unknown

        for (let attempt = 0; attempt <= 3; attempt++) {
          try {
            const response = await client.responses.parse({
              model: model ?? "gpt-5.6-luna",
              input,
              text: {
                format: zodTextFormat(scoringSchema, "Scoring")
              }
            })
            score = scoringSchema.parse(response.output_parsed).score
            break
          } catch (error) {
            lastError = error
          }
        }

        if (score === undefined) {
          throw lastError instanceof Error
            ? lastError
            : new Error("Failed to create a valid scoring response")
        }

        return {
          score,
          item
        }
      })
    )

    let resultObject

    if (resultsType === "score") {
      const avgScore =
        evaluationResults.reduce((sum, { score = 0 }) => sum + score, 0) / evaluationResults.length

      resultObject = {
        results: evaluationResults,
        scoreResults: {
          value: avgScore
        }
      }
    }

    if (resultsType === "binary") {
      const binaryResults = evaluationResults.reduce(
        (acc, { score }) => {
          if (score >= 0) {
            acc.trueCount++
          } else {
            acc.falseCount++
          }
          return acc
        },
        { trueCount: 0, falseCount: 0 }
      )

      resultObject = {
        results: evaluationResults,
        binaryResults
      }
    }

    if (!resultObject) throw new Error("No result object was created")

    return resultObject as unknown as EvaluationResponse<T>
  }

  execute.evalType = "model-graded" as const

  return execute
}
