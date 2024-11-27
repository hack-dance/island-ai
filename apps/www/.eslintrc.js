/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.mjs", "*.js"]
    }
  ],
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.ts"
    }
  }
}
