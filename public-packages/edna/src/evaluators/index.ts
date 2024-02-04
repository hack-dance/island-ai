import { EvaluationResponse, Evaluator, ExecuteEvalParams, ResultsType } from "@/types"
import z from "zod"
import { createAgent, type CreateAgentParams } from "zod-stream"

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
  model?: CreateAgentParams["defaultClientOptions"]["model"]
  messages?: CreateAgentParams["defaultClientOptions"]["messages"]
  client: CreateAgentParams["client"]
}): Evaluator<T> {
  if (!evaluationDescription || typeof evaluationDescription !== "string") {
    throw new Error("Evaluation description was not provided.")
  }

  const execute = async ({ data }: ExecuteEvalParams): Promise<EvaluationResponse<T>> => {
    const agent = createAgent({
      client,
      response_model: {
        schema: scoringSchema,
        name: "Scoring"
      },
      defaultClientOptions: {
        model: model ?? "gpt-4-1106-preview",
        messages: [
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
          ...(messages ?? [])
        ]
      }
    })

    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { prompt, completion, expectedCompletion } = item

        const response = await agent.completion({
          messages: [
            {
              role: "system",
              content: `prompt: ${prompt} \n completion: ${completion}\n  ${expectedCompletion?.length ? `expectedCompletion: ${expectedCompletion}\n` : " "}Please provide your score now:`
            }
          ]
        })

        return {
          score: response["score"],
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

  return execute
}
