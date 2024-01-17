import { defineConfig } from "tsup"

export default defineConfig(options => {
  return {
    splitting: true,
    entry: ["src/**/*.{ts,tsx}"],
    format: ["esm", "cjs"],
    dts: true,
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
    clean: true,
    external: ["react", "react-dom", "zod-stream"],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"'
      }
    },
    ...options
  }
})
