import { defineConfig } from "tsup"

export default defineConfig(options => {
  return {
    splitting: true,
    entry: ["src/**/*.{ts,tsx}"],
    format: ["esm"],
    dts: true,
    minify: true,
    clean: true,
    external: ["openai", "zod"],
    ...options
  }
})
