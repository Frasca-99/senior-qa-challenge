const js = require("@eslint/js");
const cypress = require("eslint-plugin-cypress");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "cypress/reports/",
      "cypress/screenshots/",
      "cypress/videos/",
      "cypress/downloads/",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["cypress/**/*.js"],
    ...cypress.configs.recommended,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...cypress.configs.recommended.languageOptions.globals,
      },
    },
  },
];
