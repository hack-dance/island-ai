const { resolve } = require("node:path")

const project = resolve(__dirname, "tsconfig.lint.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.js", "*.js"]
    }
  ],
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.js"
    }
  }
}
