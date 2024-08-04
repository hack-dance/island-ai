# llm-polyglot

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
