---
"schema-stream": major
"zod-stream": patch
"stream-hooks": patch
---

Add Zod 4 support to `schema-stream` while retaining compatibility with Zod 3.25 and preserving progressive schema-shaped emissions. The major release corrects partial chunk and stub types, adds tested Zod compatibility adapters, removes the Ramda runtime dependency, and propagates parser failures through the stream.

Update `zod-stream` and `stream-hooks` to consume the new `schema-stream` major during versioning and raise their supported Zod 3 floor to 3.25. These packages remain Zod 3-only because their JSON Schema conversion path does not accept Zod 4 schemas.
