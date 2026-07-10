---
"schema-stream": major
"zod-stream": major
"stream-hooks": major
---

Add Zod 4 support to `schema-stream` while retaining compatibility with Zod 3.25 and preserving progressive schema-shaped emissions. The major release corrects partial chunk and stub types, adds tested Zod compatibility adapters, removes the Ramda runtime dependency, and propagates parser failures through the stream.

Move `zod-stream` to Zod 4 and its native JSON Schema conversion, modernize the OpenAI integration for OpenAI 6 structured outputs, preserve the documented legacy function-calling mode, and expose honest progressive input/output types. Move `stream-hooks` to Zod 4 and modern React contracts, validate completed streams before calling `onEnd`, and propagate stream and validation errors predictably.
