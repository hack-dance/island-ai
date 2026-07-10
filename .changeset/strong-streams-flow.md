---
"schema-stream": major
"zod-stream": major
"stream-hooks": major
---

Add Zod 4 support to `schema-stream` while retaining compatibility with Zod 3.25 and preserving progressive schema-shaped emissions. The major release corrects partial chunk and stub types, adds tested Zod compatibility adapters, removes the Ramda runtime dependency, and propagates parser failures through the stream. A new SDK-neutral `iterate()` API consumes string or byte Web streams and async iterables directly, including OpenAI Agents SDK and Vercel AI SDK text streams, with backpressure, cancellation, immutable snapshots, and split UTF-8 handling.

Move `zod-stream` to Zod 4 and its native JSON Schema conversion, modernize the OpenAI integration for OpenAI 6 structured outputs, preserve the documented legacy function-calling mode, and expose honest progressive input/output types. Consume source bytes through `SchemaStream.iterate()` so large JSON values and multi-byte characters remain intact across browser and Electron read boundaries, with deterministic 64 KB regression coverage. Move `stream-hooks` to Zod 4 and modern React contracts, validate completed streams before calling `onEnd`, and propagate stream and validation errors predictably.
