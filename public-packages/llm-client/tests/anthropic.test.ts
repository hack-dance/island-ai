import { createTestCase } from "./lib"
import { createLLMClient } from "@/index"

const anthropicClient = createLLMClient({
  provider: "anthropic",
  logLevel: "error"
})

 for await (const model of ["claude-3-opus-20240229", "claude-3-sonnet-20240229"] as const) {
  await createTestCase(anthropicClient, model)
}
