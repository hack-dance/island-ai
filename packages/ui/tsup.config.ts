import { defineConfig } from "tsup"

export default defineConfig(options => {
  return {
    splitting: true,
    entry: ["src/**/*.{ts,tsx}"],
    format: ["esm"],
    dts: true,
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
    clean: true,
    external: ["sonner", "react", "react-dom", "framer-motion", "lucide-react"],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client"'
      }
    },
    ...options
  }
})
