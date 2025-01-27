# llm-polyglot

## 2.6.0

### Minor Changes

- [#95](https://github.com/hack-dance/island-ai/pull/95) [`2f577bf`](https://github.com/hack-dance/island-ai/commit/2f577bf6827511e34002bd0a10025d1c18dd1331) Thanks [@roodboi](https://github.com/roodboi)! - basic r1 support with thinking parser to better control MD responses with thinking blocks + adjusted system prompt for r1 specific

## 2.5.0

### Minor Changes

- [#91](https://github.com/hack-dance/island-ai/pull/91) [`4378126`](https://github.com/hack-dance/island-ai/commit/43781260f4c2664cc9d07e7559589f5b247a9c25) Thanks [@roodboi](https://github.com/roodboi)! - supporting grounding/system messages/safety and more in google

### Patch Changes

- [#85](https://github.com/hack-dance/island-ai/pull/85) [`7832aeb`](https://github.com/hack-dance/island-ai/commit/7832aeb888e0b45b0f103414deb06e0718f78cc0) Thanks [@jasonm](https://github.com/jasonm)! - Adjust OAI Peer dep

- [#91](https://github.com/hack-dance/island-ai/pull/91) [`199439a`](https://github.com/hack-dance/island-ai/commit/199439aed037b3f7ee52e72ad6703a55678fd55c) Thanks [@roodboi](https://github.com/roodboi)! - Removing "additional properties" property from function parameters in gemini requests

## 2.4.0

### Minor Changes

- [#88](https://github.com/hack-dance/island-ai/pull/88) [`721ff2d`](https://github.com/hack-dance/island-ai/commit/721ff2d98c51b0052c24000ee693736a41fb2f28) Thanks [@RollForReflex](https://github.com/RollForReflex)! - Added convenience flag for grounding support within Gemini

## 2.3.1

### Patch Changes

- [#82](https://github.com/hack-dance/island-ai/pull/82) [`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138) Thanks [@roodboi](https://github.com/roodboi)! - updating docs

## 2.3.0

### Minor Changes

- [#76](https://github.com/hack-dance/island-ai/pull/76) [`556e00c`](https://github.com/hack-dance/island-ai/commit/556e00c503315c486f62bf2d6ff2a6afdf08a2f1) Thanks [@RollForReflex](https://github.com/RollForReflex)! - Added Gemini LLM support as a new provider (thank you to @jcamera)

### Patch Changes

- [#81](https://github.com/hack-dance/island-ai/pull/81) [`e192f1a`](https://github.com/hack-dance/island-ai/commit/e192f1a440b60f88f9f6982013ce6785a1e3eb9d) Thanks [@roodboi](https://github.com/roodboi)! - updating documentation everywhere

## 2.2.0

### Minor Changes

- [#72](https://github.com/hack-dance/island-ai/pull/72) [`6610b0f`](https://github.com/hack-dance/island-ai/commit/6610b0ff1ffd783a59508ebddf91a8745b573ed2) Thanks [@roodboi](https://github.com/roodboi)! - updated to use latest tool calling format

## 2.1.0

### Minor Changes

- [#67](https://github.com/hack-dance/island-ai/pull/67) [`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca) Thanks [@roodboi](https://github.com/roodboi)! - updating required peer dep on zod to better align with all other packages as well as the one required ecternal zod to json schema dependency.

## 2.0.0

### Major Changes

- [#60](https://github.com/hack-dance/island-ai/pull/60) [`92434c6`](https://github.com/hack-dance/island-ai/commit/92434c62a3dcf53f073ccbbc56abea8e652f201d) Thanks [@roodboi](https://github.com/roodboi)! - update anthropic tool use api to use new stable + streaming json

## 1.0.1

### Patch Changes

- [`8866730`](https://github.com/hack-dance/island-ai/commit/8866730aa7f59cdaa9b9671563966ab79ca43a7a) Thanks [@roodboi](https://github.com/roodboi)! - Update stream usage collection for anthropic provider

## 1.0.0

### Major Changes

- [#48](https://github.com/hack-dance/island-ai/pull/48) [`5fc272d`](https://github.com/hack-dance/island-ai/commit/5fc272d12f7dafb8af3dce04ee400e75203665f4) Thanks [@roodboi](https://github.com/roodboi)! - Updating anthropic provider to use the new tools api that supports json out the box - this moves away from the xml parsing in and out and intro=duces a new limitation in that you can no longer stream tool output - prevously we allowed it although we would only stream content and the tool output wouldnt be available until the end so this isnt really much of a reduction in functionality as it is getting things more inline with what hte underlying api currently supports - because of the signifigant changes this does require a major bump

## 0.0.3

### Patch Changes

- [#45](https://github.com/hack-dance/island-ai/pull/45) [`e32c0f1`](https://github.com/hack-dance/island-ai/commit/e32c0f10e37b9e11f2792d9ad6f11c9b3facefeb) Thanks [@roodboi](https://github.com/roodboi)! - handle numbers better

## 0.0.2

### Patch Changes

- [#43](https://github.com/hack-dance/island-ai/pull/43) [`068a11e`](https://github.com/hack-dance/island-ai/commit/068a11e4aa80ed9849617fe094474687df79fc0b) Thanks [@roodboi](https://github.com/roodboi)! - updating the function parsing to better handle array types

## 0.0.1

### Patch Changes

- [#39](https://github.com/hack-dance/island-ai/pull/39) [`f5acc1784925c2726eeb3fd0a9f491ab0c6f5758`](https://github.com/hack-dance/island-ai/commit/f5acc1784925c2726eeb3fd0a9f491ab0c6f5758) Thanks [@roodboi](https://github.com/roodboi)! - protect against parsing tokens if we have hit an ended state in schema-stream. add initial function calling support in lly-polyglot
