import { EvaluationResponse, Evaluator, ExecuteEvalParams } from "@/types"

/**
 * The 'createWeightedAccuracyEvaluator' creates a weighted evaluator which computes evaluation scores based on the weighted average of multiple evaluators.
 * The weighted evaluator is useful when you want to combine the results of multiple evaluators to create a more comprehensive performance metric.
 *
 * Output:
 * The function's execute method, when called, returns the following information -
 * - results: contains the score for each item in the data array
 * - binaryResult: contains the number of times the agent's response was pass or fail
 * - scoreResults: contains the average, weighted score of all the items in the data array
 *
 * This weighted evaluator offers a more comprehensive perspective than a simple accuracy calculation and helps to understand the nuances in the model's responses. These weights can then be adjusted according to the specific needs to create a more tailored performance metric.
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
