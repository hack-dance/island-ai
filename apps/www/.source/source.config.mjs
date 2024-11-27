// source.config.ts
import { defineDocs } from "fumadocs-mdx/config";
var { docs, meta } = defineDocs({
  dir: "./src/content/docs"
});
export {
  docs,
  meta
};
