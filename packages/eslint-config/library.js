const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  globals: {
    JSX: true
  },
  env: {
    node: true
  },
  settings: {
    "import/resolver": {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  rules: {
    "no-prototype-builtins": "off",
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
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"]
    }
  ]
}
