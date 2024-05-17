import { AccuracyEvaluationResponse, AccuracyEvaluator } from "@/types"
import { distance } from "fastest-levenshtein"
import OpenAI from "openai"

/**
 * Calculate the dot product of two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns The dot product
 */
function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, index) => sum + val * b[index], 0)
}

/**
 * Calculate the cosine similarity between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns The cosine similarity (0 to 1)
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = dot(a, b)
  const magnitudeA = Math.sqrt(dot(a, a))
  const magnitudeB = Math.sqrt(dot(b, b))
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}

export function createAccuracyEvaluator({
  accuracyType = "levenshtein"
}: {
  accuracyType?: "levenshtein" | "semantic"
}): AccuracyEvaluator {
  const execute = async ({
    data
  }: {
    data: { completion: string; expectedCompletion: string }[]
  }): Promise<AccuracyEvaluationResponse> => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { completion, expectedCompletion } = item

        let score = 0

        switch (accuracyType) {
          case "levenshtein": {
            const levDist = distance(completion, expectedCompletion)
            score = 1 - levDist / Math.max(completion.length, expectedCompletion.length)
            break
          }
          case "semantic": {
            const [completionEmbedding, expectedEmbedding] = await Promise.all([
              openai.embeddings.create({ input: [completion], model: "text-embedding-3-small" }),
              openai.embeddings.create({
                input: [expectedCompletion],
                model: "text-embedding-3-small"
              })
            ])

            score = cosineSimilarity(
              completionEmbedding.data[0].embedding,
              expectedEmbedding.data[0].embedding
            )
            break
          }
          default:
            score = 0
        }

        return {
          completion,
          expectedCompletion,
          score
        }
      })
    )

    const avgScore =
      evaluationResults.reduce((sum, { score = 0 }) => sum + score, 0) / evaluationResults.length

    return {
      results: evaluationResults,
      scoreResults: {
        value: avgScore
      }
    }
  }

  return execute
}
