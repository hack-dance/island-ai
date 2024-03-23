const { resolve } = require("node:path")

const project = resolve(__dirname, "tsconfig.lint.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.cjs"],
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project
  },
  rules: {
    "no-dupe-class-members": "off",
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.js", "*.js"]
    }
  ]
}
