import { EvaluationResponse, Evaluator } from "@/types"
import { distance } from "fastest-levenshtein"
import OpenAI from "openai"

import { cosineSimilarity } from "@/lib/cosine"

export function createAccuracyEvaluator({
  model,
  weights = { factual: 0.5, semantic: 0.5 }
}: {
  model?: OpenAI.Embeddings.EmbeddingCreateParams["model"]
  weights?: { factual: number; semantic: number }
}): Evaluator<"score"> {
  const execute = async ({
    data
  }: {
    data: { completion: string; expectedCompletion?: string }[]
  }): Promise<EvaluationResponse<"score">> => {
    const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] })

    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { completion, expectedCompletion } = item

        if (!completion || !expectedCompletion) {
          console.warn("Completion or expected completion is missing.")
          return undefined
        }

        try {
          const factualDistance = distance(completion, expectedCompletion)
          const factualScore =
            1 - factualDistance / Math.max(completion.length, expectedCompletion.length)

          const [completionEmbedding, expectedEmbedding] = await Promise.all([
            openai.embeddings.create({
              input: [completion],
              model: model ?? "text-embedding-ada-002"
            }),
            openai.embeddings.create({
              input: [expectedCompletion],
              model: model ?? "text-embedding-ada-002"
            })
          ])

          const semanticScore = cosineSimilarity(
            completionEmbedding.data[0].embedding,
            expectedEmbedding.data[0].embedding
          )

          const score = weights.factual * factualScore + weights.semantic * semanticScore

          return {
            item: {
              completion,
              expectedCompletion
            },
            score
          }
        } catch (error) {
          console.error("Error in accuracy evaluation:", error)
          return undefined
        }
      })
    )

    const validResults = evaluationResults.filter(
      (e): e is NonNullable<typeof e> => e !== undefined
    )

    const avgScore =
      validResults.length > 0
        ? validResults.reduce((sum, { score }) => sum + score, 0) / validResults.length
        : 0

    return {
      results: validResults,
      scoreResults: {
        value: avgScore
      }
    }
  }

  execute.evalType = "accuracy" as const
  return execute
}
