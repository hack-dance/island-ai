import { deepEqual } from "node:assert/strict"
import { EvaluationDataItemResultSchema, type EvaluationDataItemResult } from "evalz"

const result: EvaluationDataItemResult = {
  score: 1,
  scores: [{ score: 1, evaluator: "accuracy", evaluatorType: "accuracy" }],
  item: { completion: "example" }
}

deepEqual(EvaluationDataItemResultSchema.parse(result), result)
console.log("packed evalz Zod 3 types and runtime passed")
