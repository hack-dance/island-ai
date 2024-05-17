import { EvaluationResponse, Evaluator, ExecuteEvalParams } from "@/types"

/**
 * @name createWeightedEvaluator
 * @description
 * Create a weighted evaluator that combines the results of multiple evaluators
 * @param evaluators - A record of evaluators to combine
 * @param weights - A record of weights for each evaluator
 * @returns A weighted evaluator
 */
export function createWeightedEvaluator({
  evaluators,
  weights
}: {
  evaluators: Record<string, Evaluator<"score">>
  weights: Record<string, number>
}): Evaluator<"score"> {
  if (
    Object.keys(weights).length !== Object.keys(evaluators).length ||
    !Object.keys(weights).every(key => key in evaluators)
  ) {
    throw new Error("Each evaluator must have a corresponding weight and vice versa.")
  }

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
  if (totalWeight !== 1) {
    throw new Error("The sum of weights must be 1")
  }

  const execute = async ({ data }: ExecuteEvalParams): Promise<EvaluationResponse<"score">> => {
    const evaluationResults = await Promise.all(
      data.map(async item => {
        const { prompt, completion, expectedCompletion } = item

        const evaluatorResults = await Promise.all(
          Object.keys(evaluators).map(async key => {
            const evaluator = evaluators[key]
            const result = await evaluator({
              data: [{ prompt, completion, expectedCompletion }]
            })
            return result.results[0].score
          })
        )

        const weightedScore = Object.keys(weights).reduce(
          (sum, key, index) => sum + Number(weights[key]) * Number(evaluatorResults[index]),
          0
        )

        return {
          score: weightedScore,
          scores: evaluatorResults,
          item: { prompt, expectedCompletion, completion }
        }
      })
    )

    const weightedScore =
      evaluationResults.reduce((sum, { score = 0 }) => sum + score, 0) / evaluationResults.length

    return {
      results: evaluationResults.map(er => ({
        ...er,
        score: { value: er.score }
      })),
      scoreResults: {
        value: weightedScore
      }
    }
  }

  return execute
}
