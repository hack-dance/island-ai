const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "eslint:recommended",
    "prettier",
    "eslint-config-turbo"
  ],
  plugins: ["@typescript-eslint", "prettier", "only-warn"],
  globals: {
    JSX: true
  },
  env: {
    browser: true
  },
  rules: {
    "prettier/prettier": "error",
    "linebreak-style": "off",
    "semi": "off",
    "indent": "off",
    "@typescript-eslint/semi": "off",
    "tailwindcss/no-custom-classname": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "react/no-unknown-property": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ]
  },
  settings: {
    "import/resolver": {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/"
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] }
  ]
}
