# schema-stream

## 3.2.2

### Patch Changes

- [#82](https://github.com/hack-dance/island-ai/pull/82) [`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138) Thanks [@roodboi](https://github.com/roodboi)! - updating docs

## 3.2.1

### Patch Changes

- [#81](https://github.com/hack-dance/island-ai/pull/81) [`e192f1a`](https://github.com/hack-dance/island-ai/commit/e192f1a440b60f88f9f6982013ce6785a1e3eb9d) Thanks [@roodboi](https://github.com/roodboi)! - updating documentation everywhere

## 3.2.0

### Minor Changes

- [#67](https://github.com/hack-dance/island-ai/pull/67) [`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca) Thanks [@roodboi](https://github.com/roodboi)! - updating required peer dep on zod to better align with all other packages as well as the one required ecternal zod to json schema dependency.

## 3.1.0

### Minor Changes

- [#39](https://github.com/hack-dance/island-ai/pull/39) [`f5acc1784925c2726eeb3fd0a9f491ab0c6f5758`](https://github.com/hack-dance/island-ai/commit/f5acc1784925c2726eeb3fd0a9f491ab0c6f5758) Thanks [@roodboi](https://github.com/roodboi)! - protect against parsing tokens if we have hit an ended state in schema-stream. add initial function calling support in lly-polyglot

## 3.0.0

### Major Changes

- [#32](https://github.com/hack-dance/island-ai/pull/32) [`008d007b1ec9cc7f1276ae92bd0c32dfef801c38`](https://github.com/hack-dance/island-ai/commit/008d007b1ec9cc7f1276ae92bd0c32dfef801c38) Thanks [@roodboi](https://github.com/roodboi)! - Updating the defaults to all be null except for objects and arrays - also not explicitly looking for .default values

  Previously we had "", 0, and false default values for primitives (silly) - you could still pass nulls as defaults through the explicit defaultValues map - but this is now the default and they can be updated either via zod .default or using the defaultValues map if there is a need for a more explicit default.

## 2.1.0

### Minor Changes

- [#12](https://github.com/hack-dance/island-ai/pull/12) [`36eb93ecfec2d3d145238b4f5f80009320917f25`](https://github.com/hack-dance/island-ai/commit/36eb93ecfec2d3d145238b4f5f80009320917f25) Thanks [@roodboi](https://github.com/roodboi)! - Adding support for zod default()

## 2.0.1

### Patch Changes

- [`bc1b41792c23ae11b29435f7d9f6910e337a69ec`](https://github.com/hack-dance/schema-stream/commit/bc1b41792c23ae11b29435f7d9f6910e337a69ec) Thanks [@roodboi](https://github.com/roodboi)! - hot patch to fix bad view update

## 2.0.0

### Major Changes

- [#9](https://github.com/hack-dance/schema-stream/pull/9) [`cbf57f0a202f5bb662df8761410e78ee49e819af`](https://github.com/hack-dance/schema-stream/commit/cbf57f0a202f5bb662df8761410e78ee49e819af) Thanks [@roodboi](https://github.com/roodboi)! - Updating the completion tracking to use paths vs keys

### Patch Changes

- [`08b86d0754df3a813374a6fba4117ba9974c3daf`](https://github.com/hack-dance/schema-stream/commit/08b86d0754df3a813374a6fba4117ba9974c3daf) Thanks [@roodboi](https://github.com/roodboi)! - updating lint rules and fixing a bad undefined check

## 1.6.0

### Minor Changes

- [`d6c6fa587267807f60123fbafc35db036aabf037`](https://github.com/hack-dance/schema-stream/commit/d6c6fa587267807f60123fbafc35db036aabf037) Thanks [@roodboi](https://github.com/roodboi)! - fixing build

## 1.5.0

### Minor Changes

- [`4a4b9dbf5501db7a12dba082609b3c4501acacdb`](https://github.com/hack-dance/schema-stream/commit/4a4b9dbf5501db7a12dba082609b3c4501acacdb) Thanks [@roodboi](https://github.com/roodboi)! - fixing build so package isnt empty

## 1.4.1

### Patch Changes

- [`31f5aec1a99654393dd0fc485319992f19cb71be`](https://github.com/hack-dance/schema-stream/commit/31f5aec1a99654393dd0fc485319992f19cb71be) Thanks [@roodboi](https://github.com/roodboi)! - putting readme back

## 1.4.0

### Minor Changes

- [`1f01fad0ca99903550439b627f3f335b25923508`](https://github.com/hack-dance/schema-stream/commit/1f01fad0ca99903550439b627f3f335b25923508) Thanks [@roodboi](https://github.com/roodboi)! - Removing string streaming flag as it is no longer used - this will be first publish from new repo

## 1.3.0

### Minor Changes

- [`a88a1c8`](https://github.com/hack-dance/agents/commit/a88a1c84bb000a40913884f62beaecf76b6faab1) Thanks [@roodboi](https://github.com/roodboi)! - Adding optional type defaults to allow for nulling out defaults in addition to the default data option

## 1.2.1

### Patch Changes

- [`0887740`](https://github.com/hack-dance/agents/commit/088774077c5ec6b18b07709b1c3b0f34e7abc1f8) Thanks [@roodboi](https://github.com/roodboi)! - remove log

## 1.2.0

### Minor Changes

- [#49](https://github.com/hack-dance/agents/pull/49) [`7154c1b`](https://github.com/hack-dance/agents/commit/7154c1b5883015bd9244189d7396ce530732dd13) Thanks [@roodboi](https://github.com/roodboi)! - adding support for zod effects and ensuring parital streams apply only to strings

## 1.1.0

### Minor Changes

- [#47](https://github.com/hack-dance/agents/pull/47) [`906a0b9`](https://github.com/hack-dance/agents/commit/906a0b9c90228ccfa14ab0c4e1961f60a5cc5ca3) Thanks [@roodboi](https://github.com/roodboi)! - add new options for string buffer size and hadnling of unescaped new lines

## 1.0.0

### Major Changes

- [#45](https://github.com/hack-dance/agents/pull/45) [`76342d4`](https://github.com/hack-dance/agents/commit/76342d4c40eee773887564432c97f931785ace33) Thanks [@roodboi](https://github.com/roodboi)! - Forked the json parser package instead of t rying to work around it - updated props and things to accept default data and am now returning a few things like activeKey

## 0.0.2

### Patch Changes

- [`408b0c7`](https://github.com/hack-dance/agents/commit/408b0c746a93bdc800cbe09363995408d1df94d7) Thanks [@roodboi](https://github.com/roodboi)! - Update streaming string value so that we dont get a colon at the start of the string

## 0.0.1

### Patch Changes

- [#29](https://github.com/hack-dance/agents/pull/29) [`ed6015d`](https://github.com/hack-dance/agents/commit/ed6015d732b690f960045bdb500be7924f4d59ff) Thanks [@roodboi](https://github.com/roodboi)! - initial re-release of new package breakdown
