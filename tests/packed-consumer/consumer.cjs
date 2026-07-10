const schemaStream = require("schema-stream")
const zodStream = require("zod-stream")
const streamHooks = require("stream-hooks")

if (
  typeof schemaStream.SchemaStream !== "function" ||
  typeof zodStream.default !== "function" ||
  typeof streamHooks.consumeJsonStream !== "function"
) {
  throw new Error("packed consumer CommonJS exports mismatch")
}

console.log("packed consumer CommonJS exports passed")
