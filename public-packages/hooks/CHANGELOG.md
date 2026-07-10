# stream-hooks

## 4.0.0

### Major Changes

- [#103](https://github.com/hack-dance/island-ai/pull/103) [`acd1b2f`](https://github.com/hack-dance/island-ai/commit/acd1b2f79ea3c87c498c16cb00f9aa6f1e407c90) Thanks [@roodboi](https://github.com/roodboi)! - Add Zod 4 support to `schema-stream` while retaining compatibility with Zod 3.25 and preserving progressive schema-shaped emissions. The major release corrects partial chunk and stub types, adds tested Zod compatibility adapters, removes the Ramda runtime dependency, and propagates parser failures through the stream. A new SDK-neutral `iterate()` API consumes string or byte Web streams and async iterables directly, including OpenAI Agents SDK and Vercel AI SDK text streams, with backpressure, cancellation, immutable snapshots, and split UTF-8 handling.

  Move `zod-stream` to Zod 4 and its native JSON Schema conversion, modernize the OpenAI integration for OpenAI 6 structured outputs, preserve the documented legacy function-calling mode, and expose honest progressive input/output types. Consume source bytes through `SchemaStream.iterate()` so large JSON values and multi-byte characters remain intact across browser and Electron read boundaries, with deterministic 64 KB regression coverage. Move `stream-hooks` to Zod 4 and modern React contracts, validate completed streams before calling `onEnd`, and propagate stream and validation errors predictably.

### Patch Changes

- Updated dependencies [[`acd1b2f`](https://github.com/hack-dance/island-ai/commit/acd1b2f79ea3c87c498c16cb00f9aa6f1e407c90)]:
  - zod-stream@4.0.0

## 3.0.0

### Patch Changes

- Updated dependencies [[`2f577bf`](https://github.com/hack-dance/island-ai/commit/2f577bf6827511e34002bd0a10025d1c18dd1331)]:
  - zod-stream@3.0.0

## 2.0.2

### Patch Changes

- [#82](https://github.com/hack-dance/island-ai/pull/82) [`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138) Thanks [@roodboi](https://github.com/roodboi)! - updating docs

- Updated dependencies [[`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138)]:
  - zod-stream@2.0.2

## 2.0.0

### Minor Changes

- [#67](https://github.com/hack-dance/island-ai/pull/67) [`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca) Thanks [@roodboi](https://github.com/roodboi)! - updating required peer dep on zod to better align with all other packages as well as the one required ecternal zod to json schema dependency.

### Patch Changes

- Updated dependencies [[`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca)]:
  - zod-stream@2.0.0

## 1.0.4

### Patch Changes

- [#57](https://github.com/hack-dance/island-ai/pull/57) [`dcd090c`](https://github.com/hack-dance/island-ai/commit/dcd090cc13022488cfcbd99007933b238bd93f74) Thanks [@roodboi](https://github.com/roodboi)! - Adding new evaluator types - lots of documentation and more tests

## 1.0.0

### Patch Changes

- Updated dependencies [[`1f6b63175bf5baa787b0e38e8decb1c811a49bec`](https://github.com/hack-dance/island-ai/commit/1f6b63175bf5baa787b0e38e8decb1c811a49bec)]:
  - zod-stream@1.0.0

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - zod-stream@0.0.8

## 0.0.3

### Patch Changes

- [#28](https://github.com/hack-dance/island-ai/pull/28) [`a79bd11a9caaf4f9d99eebe0e528b04fd4ca811e`](https://github.com/hack-dance/island-ai/commit/a79bd11a9caaf4f9d99eebe0e528b04fd4ca811e) Thanks [@roodboi](https://github.com/roodboi)! - adjust peer and dev deps

## 0.0.2

### Patch Changes

- [`2e9c39de36385887f0a8fd3c7c69302f7981cbf0`](https://github.com/hack-dance/island-ai/commit/2e9c39de36385887f0a8fd3c7c69302f7981cbf0) Thanks [@roodboi](https://github.com/roodboi)! - ensure the full resposne is sent back in the onEnd callback

## 0.0.1

### Patch Changes

- [`c3cbe97f01f3532038dc041ccb9a43e2cdb73e97`](https://github.com/hack-dance/island-ai/commit/c3cbe97f01f3532038dc041ccb9a43e2cdb73e97) Thanks [@roodboi](https://github.com/roodboi)! - Initial stable release

- Updated dependencies [[`c3cbe97f01f3532038dc041ccb9a43e2cdb73e97`](https://github.com/hack-dance/island-ai/commit/c3cbe97f01f3532038dc041ccb9a43e2cdb73e97)]:
  - zod-stream@0.0.1
