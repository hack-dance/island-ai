import sharedConfig from "@repo/tailwind-config/tailwind.config"
import { createPreset } from "fumadocs-ui/tailwind-plugin"
import type { Config } from "tailwindcss"

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "../../packages/ui/src/**/*.{mjs,js,ts,jsx,tsx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [sharedConfig, createPreset()]
}

export default config
