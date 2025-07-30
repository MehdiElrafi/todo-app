import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // ✅ Cypress test files support
  {
    files: ["cypress/**/*.js", "cypress/**/*.ts", "cypress.config.js"],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // You can extend or override rules here
    },
  },
  prettier,
];