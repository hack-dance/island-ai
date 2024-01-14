const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

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
    React: true,
    JSX: true
  },
  env: {
    node: true,
    browser: true
  },
  settings: {
    "import/resolver": {
      typescript: {
        project
      }
    },
    "tailwindcss": {
      callees: ["cn"],
      config: "tailwind.config.js"
    }
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
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ]
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/"
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }]
}
