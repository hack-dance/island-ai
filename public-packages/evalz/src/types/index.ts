import { z } from "zod"

// Preserve the object type of the consumer's Zod version in the emitted declarations.
type ObjectSchema<Shape extends z.ZodRawShape> = ReturnType<typeof z.object<Shape>>

const evaluationDataItemShape = {
  prompt: z.string().optional(),
  completion: z.string(),
  expectedCompletion: z.string().optional(),
  contexts: z.array(z.string()).optional(),
  groundTruth: z.string().optional()
}

export const BaseEvaluationDataItemSchema: ObjectSchema<typeof evaluationDataItemShape> =
  z.object(evaluationDataItemShape)

export const EvaluationDataItemSchema: typeof BaseEvaluationDataItemSchema =
  BaseEvaluationDataItemSchema

const evaluationScoreShape = {
  score: z.number(),
  evaluator: z.string(),
  evaluatorType: z.string()
}

export const EvaluationDataItemResultSchema: ObjectSchema<{
  score: z.ZodNumber
  scores: z.ZodOptional<z.ZodArray<ObjectSchema<typeof evaluationScoreShape>>>
  item: typeof EvaluationDataItemSchema
}> = z.object({
  score: z.number(),
  scores: z.array(z.object(evaluationScoreShape)).optional(),
  item: EvaluationDataItemSchema
})

export type ResultsType = "score" | "binary"
export type BinaryResults = {
  trueCount: number
  falseCount: number
}

export type AvgScoreResults = {
  value: number
  individual?: Record<string, number>
}

export type EvaluationDataItem = z.infer<typeof EvaluationDataItemSchema>
export type EvaluationDataItemResult = z.infer<typeof EvaluationDataItemResultSchema>

export type EvaluationResponse<T extends ResultsType> = {
  results: EvaluationDataItemResult[]
} & (T extends "score" ? { scoreResults: AvgScoreResults } : { binaryResults: BinaryResults })

export type ExecuteEvalParams = { data: EvaluationDataItem[] }

interface EvalFunction extends Function {
  evalType: "model-graded" | "accuracy" | `context-${ContextEvaluatorType}` | "weighted"
}

export type _Evaluator<T extends ResultsType> = ({
  data
}: ExecuteEvalParams) => Promise<EvaluationResponse<T>>

export interface Evaluator<T extends ResultsType> extends _Evaluator<T>, EvalFunction {}

export type ContextEvaluatorType = "entities-recall" | "precision" | "recall" | "relevance"

export type ContextEvaluator = Evaluator<"score">

export type AccuracyEvaluator = Evaluator<"score">
