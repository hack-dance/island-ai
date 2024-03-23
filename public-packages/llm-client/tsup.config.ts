import { defineConfig } from "tsup"

export default defineConfig(options => {
  return {
    splitting: true,
    sourcemap: true,
    minify: true,
    entry: ["src/index.ts"],
    target: "esnext",
    format: ["cjs", "esm"],
    clean: true,
    dts: true,
    external: ["openai", "zod", "@anthropic-ai/sdk"],
    ...options
  }
})
