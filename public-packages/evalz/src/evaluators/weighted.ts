import { AccuracyEvaluator, EvaluationResponse, Evaluator, ExecuteEvalParams } from "@/types"

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
  evaluators: Record<string, Evaluator<"score"> | AccuracyEvaluator>
  weights: Record<string, number>
}): Evaluator<"score"> {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
  if (totalWeight !== 1) {
    throw new Error("The sum of weights must be 1")
  }

  if (
    Object.keys(weights).length !== Object.keys(evaluators).length ||
    !Object.keys(weights).every(key => key in evaluators)
  ) {
    throw new Error("Each evaluator must have a corresponding weight and vice versa.")
  }

  const execute = async ({ data }: ExecuteEvalParams): Promise<EvaluationResponse<"score">> => {
    const evaluationResults = await Promise.all(
      data.map(async item => {
        const {
          prompt = "",
          completion,
          expectedCompletion = "",
          contexts = [],
          groundTruth = ""
        } = item

        const evaluatorResults = await Promise.all(
          Object.keys(evaluators).map(async key => {
            const evaluator = evaluators[key]

            const isAccuracyEvaluator = evaluator.evalType === "accuracy"
            const isModelGradedEvaluator = evaluator.evalType === "model-graded"
            const isContextEvaluator = evaluator.evalType?.startsWith("context-")

            if (isAccuracyEvaluator) {
              console.log(`Evaluating ${key} with accuracy`)
            } else if (isModelGradedEvaluator) {
              console.log(`Evaluating ${key} with model-graded`)
            } else if (isContextEvaluator) {
              console.log(`Evaluating ${key} with ${evaluator.evalType}`)
            }

            try {
              const result = isAccuracyEvaluator
                ? await (evaluator as AccuracyEvaluator)({
                    data: [{ completion, expectedCompletion }]
                  })
                : await (evaluator as Evaluator<"score">)({
                    data: [
                      {
                        prompt,
                        completion,
                        expectedCompletion,
                        contexts,
                        groundTruth
                      }
                    ]
                  })

              return result?.scoreResults?.value !== undefined
                ? {
                    score: result?.scoreResults?.value,
                    evaluator: key,
                    evaluatorType: evaluator.evalType
                  }
                : undefined
            } catch (error) {
              console.error(`Error evaluating ${key}:`, error)
              return undefined
            }
          })
        )

        const validResults = evaluatorResults.filter(
          (e): e is NonNullable<typeof e> => e !== undefined
        )

        if (validResults.length === 0) {
          console.warn("No valid results for", item)
          return {
            score: NaN,
            scores: [],
            item
          }
        }

        const weightedScore = Object.keys(weights).reduce(
          (sum, key, index) => sum + weights[key] * (validResults?.[index]?.score ?? 0),
          0
        )

        return {
          score: weightedScore,
          scores: validResults,
          item
        }
      })
    )

    const validResults = evaluationResults.filter(
      (e): e is NonNullable<typeof e> => !isNaN(e.score)
    )

    const weightedScore =
      validResults.length > 0
        ? validResults.reduce((sum, { score = 0 }) => sum + score, 0) / validResults.length
        : 0

    const individualAvgScores = Object.keys(evaluators).reduce(
      (acc, key) => {
        const scores = validResults.map(vr => vr.scores.find(s => s.evaluator === key)?.score ?? 0)
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
        acc[key] = avgScore
        return acc
      },
      {} as Record<string, number>
    )

    return {
      results: validResults.map(er => ({
        ...er,
        score: er.score
      })),
      scoreResults: {
        value: weightedScore,
        individual: individualAvgScores
      }
    }
  }

  execute.evalType = "weighted" as const
  return execute
}
