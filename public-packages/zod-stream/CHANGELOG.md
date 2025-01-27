# zod-stream

## 3.0.0

### Minor Changes

- [#95](https://github.com/hack-dance/island-ai/pull/95) [`2f577bf`](https://github.com/hack-dance/island-ai/commit/2f577bf6827511e34002bd0a10025d1c18dd1331) Thanks [@roodboi](https://github.com/roodboi)! - basic r1 support with thinking parser to better control MD responses with thinking blocks + adjusted system prompt for r1 specific

## 2.0.2

### Patch Changes

- [#82](https://github.com/hack-dance/island-ai/pull/82) [`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138) Thanks [@roodboi](https://github.com/roodboi)! - updating docs

- Updated dependencies [[`a5561ba`](https://github.com/hack-dance/island-ai/commit/a5561ba464c7fd8680c97a5a4fb04e82e976f138)]:
  - schema-stream@3.2.2

## 2.0.1

### Patch Changes

- [#81](https://github.com/hack-dance/island-ai/pull/81) [`e192f1a`](https://github.com/hack-dance/island-ai/commit/e192f1a440b60f88f9f6982013ce6785a1e3eb9d) Thanks [@roodboi](https://github.com/roodboi)! - updating documentation everywhere

- Updated dependencies [[`e192f1a`](https://github.com/hack-dance/island-ai/commit/e192f1a440b60f88f9f6982013ce6785a1e3eb9d)]:
  - schema-stream@3.2.1

## 2.0.0

### Minor Changes

- [#67](https://github.com/hack-dance/island-ai/pull/67) [`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca) Thanks [@roodboi](https://github.com/roodboi)! - updating required peer dep on zod to better align with all other packages as well as the one required ecternal zod to json schema dependency.

### Patch Changes

- Updated dependencies [[`d2a1ee5`](https://github.com/hack-dance/island-ai/commit/d2a1ee5f04e5f95f0755c3ad39766573b29962ca)]:
  - schema-stream@3.2.0

## 1.0.3

### Patch Changes

- [`0708276`](https://github.com/hack-dance/island-ai/commit/0708276f32ee6de6ccb81de90a54d6d0e3463ec2) Thanks [@roodboi](https://github.com/roodboi)! - Extra check on delta content - make sure we default in cases where its undefined - primarily to help catch new messages for stream usage at the end of a stream

## 1.0.2

### Patch Changes

- [#50](https://github.com/hack-dance/island-ai/pull/50) [`6a018c6`](https://github.com/hack-dance/island-ai/commit/6a018c6d9623120296a3abe954cb43f6209ac937) Thanks [@roodboi](https://github.com/roodboi)! - remove control characthers from string

## 1.0.1

### Patch Changes

- [#41](https://github.com/hack-dance/island-ai/pull/41) [`8d0ec77`](https://github.com/hack-dance/island-ai/commit/8d0ec77948510ff7aedf6327fdaa168a89873e76) Thanks [@roodboi](https://github.com/roodboi)! - Updating schema stream

## 1.0.0

### Major Changes

- [#34](https://github.com/hack-dance/island-ai/pull/34) [`1f6b63175bf5baa787b0e38e8decb1c811a49bec`](https://github.com/hack-dance/island-ai/commit/1f6b63175bf5baa787b0e38e8decb1c811a49bec) Thanks [@roodboi](https://github.com/roodboi)! - moving the internal meta around key completino and validity into a single \_meta object on the response and adding explicit types so that consumers can reference it safely - the format has chnaged slightly from indicvidual keys on the resposne to all being wrapped up - additionalyl theres a new utility for checking completed paths

## 0.0.8

### Patch Changes

- Updated dependencies [[`008d007b1ec9cc7f1276ae92bd0c32dfef801c38`](https://github.com/hack-dance/island-ai/commit/008d007b1ec9cc7f1276ae92bd0c32dfef801c38)]:
  - schema-stream@3.0.0

## 0.0.7

### Patch Changes

- [#25](https://github.com/hack-dance/island-ai/pull/25) [`17f8583a9284731be3dcc4c2b59b6733f49c8383`](https://github.com/hack-dance/island-ai/commit/17f8583a9284731be3dcc4c2b59b6733f49c8383) Thanks [@roodboi](https://github.com/roodboi)! - Making agents export seperate and moving out the client credator defualt

## 0.0.6

### Patch Changes

- [#23](https://github.com/hack-dance/island-ai/pull/23) [`5e8a2cc7bfe39452928a434675bd23539890814a`](https://github.com/hack-dance/island-ai/commit/5e8a2cc7bfe39452928a434675bd23539890814a) Thanks [@roodboi](https://github.com/roodboi)! - Cleaning up some unused types and consants + exposing all the types and things already defined

## 0.0.5

### Patch Changes

- [#20](https://github.com/hack-dance/island-ai/pull/20) [`bf334a0f23ace44e866a37b3111ac0f312f32929`](https://github.com/hack-dance/island-ai/commit/bf334a0f23ace44e866a37b3111ac0f312f32929) Thanks [@roodboi](https://github.com/roodboi)! - updating exports slightly for wider support

- [#20](https://github.com/hack-dance/island-ai/pull/20) [`6ab5c4076c35b8b7935886eda6225b2cd7b374e2`](https://github.com/hack-dance/island-ai/commit/6ab5c4076c35b8b7935886eda6225b2cd7b374e2) Thanks [@roodboi](https://github.com/roodboi)! - add check on delta so we dont explode

## 0.0.4

### Patch Changes

- [#17](https://github.com/hack-dance/island-ai/pull/17) [`274d6af9530e9437035dda14f92948703b20dd93`](https://github.com/hack-dance/island-ai/commit/274d6af9530e9437035dda14f92948703b20dd93) Thanks [@roodboi](https://github.com/roodboi)! - update schema stream dep

## 0.0.4

### Patch Changes

- [#14](https://github.com/hack-dance/island-ai/pull/14) [`068d069798b07af96d03d9c2f063806ee04ee980`](https://github.com/hack-dance/island-ai/commit/068d069798b07af96d03d9c2f063806ee04ee980) Thanks [@roodboi](https://github.com/roodboi)! - set specific schema-stream v

## 0.0.3

### Patch Changes

- [#9](https://github.com/hack-dance/island-ai/pull/9) [`e922466f35bd72bdfce8c0710a8868cca66f1571`](https://github.com/hack-dance/island-ai/commit/e922466f35bd72bdfce8c0710a8868cca66f1571) Thanks [@roodboi](https://github.com/roodboi)! - allow for client passthrough when creating agents - will still defualt to a new OAI client

## 0.0.2

### Patch Changes

- [#5](https://github.com/hack-dance/island-ai/pull/5) [`fb5fd7354cbf5c8cdda46ff5bac5e1a2a72b6f59`](https://github.com/hack-dance/island-ai/commit/fb5fd7354cbf5c8cdda46ff5bac5e1a2a72b6f59) Thanks [@roodboi](https://github.com/roodboi)! - Adding simple agent utility - undocumented to expose and use for testing first

## 0.0.1

### Patch Changes

- [`c3cbe97f01f3532038dc041ccb9a43e2cdb73e97`](https://github.com/hack-dance/island-ai/commit/c3cbe97f01f3532038dc041ccb9a43e2cdb73e97) Thanks [@roodboi](https://github.com/roodboi)! - Initial stable release
