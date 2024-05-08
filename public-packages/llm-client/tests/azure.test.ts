import { createTestCase } from "./lib"
import { createLLMClient } from "@/index"

const azureClient = createLLMClient({
  provider: "azure",
  logLevel: "error"
})

for await (const model of ["gpt-35-turbo"] as const) {
  await createTestCase(model)
}
