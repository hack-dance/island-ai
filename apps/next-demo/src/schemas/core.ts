import z from "zod"

export const coreAgentSchema = z.object({
  listOfReasonsWhyJavascriptIsBetterThenPython: z.array(z.string()).min(10),
  listOfReasonsWhyPythonIsBetterThenJavascript: z.array(z.string()).min(1),
  listOfThingsBetterThenPython: z.array(z.string()).min(10),
  listOfFeaturesPythonLacks: z
    .array(
      z.object({
        name: z.string(),
        description: z.string()
      })
    )
    .min(10),
  finalSummary: z.string(),
  pointsForPython: z.number().min(0).max(100),
  pointsForJavascript: z.number().min(0).max(100)
})
