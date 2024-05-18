import {
  ContextEvaluator,
  ContextEvaluatorType,
  EvaluationResponse,
  ExecuteEvalParams
} from "@/types"
import { distance as levenshteinDistance } from "fastest-levenshtein"
import OpenAI from "openai"

import { cosineSimilarity } from "@/lib/cosine"

function extractEntities(text: string): string[] {
  return text.match(/\b[A-Z][a-z]*\b/g) || []
}

export function createContextEvaluator({
  type,
  model = "text-embedding-3-small"
}: {
  type: ContextEvaluatorType
  model?: OpenAI.Embeddings.EmbeddingCreateParams["model"]
}): ContextEvaluator {
  const execute = async ({ data }: ExecuteEvalParams): Promise<EvaluationResponse<"score">> => {
    const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] })

    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { prompt, contexts = [], groundTruth = "", completion } = item

        let score = 0

        switch (type) {
          case "entities-recall": {
            if (!completion) {
              throw new Error("Completion is required for entities-recall evaluation.")
            }

            const completionEntities = extractEntities(completion)
            const contextEntities = contexts.flatMap(context => extractEntities(context))
            const intersection = contextEntities.filter(entity =>
              completionEntities.includes(entity)
            )
            score = intersection.length / completionEntities.length
            break
          }

          case "precision": {
            if (!completion) {
              throw new Error("Completion is required for precision evaluation.")
            }
            const completionEmbeddingInput = prompt ? `${prompt} ${completion}` : completion
            const completionEmbedding = await openai.embeddings.create({
              input: [completionEmbeddingInput],
              model
            })
            const groundTruthEmbedding = groundTruth
              ? await openai.embeddings.create({
                  input: [groundTruth],
                  model
                })
              : null
            const contextEmbeddings = await Promise.all(
              contexts.map(context => openai.embeddings.create({ input: [context], model }))
            )

            let truePositives = 0
            let falsePositives = 0
            const precisionAtK = contextEmbeddings.map(embeddingResult => {
              const completionSimilarity = cosineSimilarity(
                completionEmbedding.data[0].embedding,
                embeddingResult.data[0].embedding
              )
              const groundTruthSimilarity = groundTruthEmbedding
                ? cosineSimilarity(
                    groundTruthEmbedding.data[0].embedding,
                    embeddingResult.data[0].embedding
                  )
                : 0

              const maxSimilarity = Math.max(completionSimilarity, groundTruthSimilarity)

              if (maxSimilarity > 0.5) {
                truePositives += 1
              } else {
                falsePositives += 1
              }

              const precisionAtIndex = truePositives / (truePositives + falsePositives)
              return precisionAtIndex
            })

            score = precisionAtK.reduce((sum, precision) => sum + precision, 0) / contexts.length
            break
          }

          case "recall": {
            if (!completion) {
              throw new Error("Completion is required for recall evaluation.")
            }
            const completionSentences = completion
              .split(".")
              .map(sentence => sentence.trim())
              .filter(Boolean)
            const contextSentences = contexts.flatMap(context =>
              context.split(".").map(sentence => sentence.trim())
            )

            const sentenceIntersection = completionSentences.filter(sentence =>
              contextSentences.some(contextSentence => {
                const levDistance = levenshteinDistance(sentence, contextSentence)
                return levDistance < Math.max(sentence.length, contextSentence.length) * 0.5
              })
            )

            score =
              completionSentences.length > 0
                ? sentenceIntersection.length / completionSentences.length
                : 0
            break
          }

          case "relevance": {
            if (!completion) {
              throw new Error("Completion is required for relevance evaluation.")
            }
            const embeddingInput = prompt && completion ? `${prompt} ${completion}` : completion
            const completionEmbedding = await openai.embeddings.create({
              input: [embeddingInput],
              model
            })
            const contextEmbeddings = await Promise.all(
              contexts.map(context => openai.embeddings.create({ input: [context], model }))
            )
            const relevanceScores = contextEmbeddings.map(embedding =>
              cosineSimilarity(completionEmbedding.data[0].embedding, embedding.data[0].embedding)
            )
            score = relevanceScores.reduce((sum, score) => sum + score, 0) / relevanceScores.length
            break
          }

          default:
            throw new Error(`Unsupported evaluation type: ${type}`)
        }

        return {
          item,
          score
        }
      })
    )

    const avgScore =
      evaluationResults.reduce((sum, { score }) => sum + score, 0) / evaluationResults.length

    return {
      results: evaluationResults,
      scoreResults: { value: avgScore }
    }
  }

  execute.evalType = `context-${type}` as const
  return execute
}
