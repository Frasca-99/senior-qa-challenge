import { After, Before } from "@badeball/cypress-cucumber-preprocessor";
import { cleanup } from "../cleanup";

// Estado compartilhado entre os passos de um mesmo cenário (resposta da API,
// usuário criado, produto criado...). É zerado antes de cada cenário.
export const state = {};

Before(() => {
  Object.keys(state).forEach((chave) => delete state[chave]);
  cleanup.limpar();
});

After(() => {
  cleanup.executar();
});

// O After do Cucumber é pulado quando um passo falha. O afterEach do Cypress
// executa a limpeza pendente nesse caso; se o After já executou, a fila está vazia.
afterEach(() => {
  cleanup.executar();
});
