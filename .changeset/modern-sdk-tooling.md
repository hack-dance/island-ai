---
"llm-polyglot": major
"evalz": major
---

Upgrade `llm-polyglot` to the OpenAI 6 client contract, including provider-safe option types, the `clientOptions` escape hatch for the SDK's own provider option, and function-tool handling. Correct package export conditions and require live provider tests to be explicitly enabled.

Move `evalz` model grading from Instructor and Chat Completions to native OpenAI 6 Responses structured outputs, with bounded validation retries and no transitive OpenAI 4 dependency. Correct package export conditions and make its model-backed test suite opt-in.
