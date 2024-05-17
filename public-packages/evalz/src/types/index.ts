import { z } from "zod"

export const EvaluationDataItemSchema = z.object({
  prompt: z.string(),
  completion: z.string(),
  expectedCompletion: z.string().optional()
})

export const EvaluationDataItemResultSchema = z.object({
  score: z.object({
    value: z.number()
  }),
  item: EvaluationDataItemSchema
})

export type ResultsType = "score" | "binary"
export type BinaryResults = {
  trueCount: number
  falseCount: number
}

export type AvgScoreResults = {
  value: number
}

export type EvaluationDataItem = z.infer<typeof EvaluationDataItemSchema>
export type EvaluationDataItemResult = z.infer<typeof EvaluationDataItemResultSchema>

export type EvaluationResponse<T extends ResultsType> = {
  results: EvaluationDataItemResult[]
} & (T extends "score" ? { scoreResults: AvgScoreResults } : { binaryResults: BinaryResults })

export type ExecuteEvalParams = { data: EvaluationDataItem[] }

export type Evaluator<T extends ResultsType> = ({
  data
}: ExecuteEvalParams) => Promise<EvaluationResponse<T>>

export type AccuracyEvaluator = ({
  data
}: {
  data: { completion: string; expectedCompletion: string }[]
}) => Promise<AccuracyEvaluationResponse>

export type AccuracyEvaluationResponse = {
  results: { completion: string; expectedCompletion: string }[]
  scoreResults: AvgScoreResults
}
