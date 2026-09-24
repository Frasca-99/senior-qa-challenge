const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  // Valores públicos ficam em `expose` (API que substitui `Cypress.env()`);
  // a suíte não depende de segredos, então `env` fica vazio e desabilitado.
  expose: {
    apiUrl: "https://serverest.dev",
  },
  allowCypressEnv: false,
  e2e: {
    baseUrl: "https://front.serverest.dev",
    specPattern: "cypress/e2e/features/**/*.feature",
    // Sem support file: as pré-condições vivem em cypress/support/massa_de_dados.js
    // e são importadas pelas step definitions (ver comentário naquele módulo).
    supportFile: false,
    video: false,
    screenshotOnRunFailure: true,
    // Sem retries: uma falha deve aparecer como falha, e não ser mascarada por
    // uma nova tentativa. A estabilidade vem da massa de dados isolada por
    // cenário e das esperas explícitas nos page objects.
    retries: 0,
    // A aplicação sob teste é pública e remota; os timeouts acomodam a latência
    // de rede sem recorrer a esperas fixas nos testes.
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );
      return config;
    },
  },
});
