import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { validarContrato } from "../contracts";
import { state } from "./hooks";

Then("a resposta deve ter status {int}", (status) => {
  expect(state.response.status, JSON.stringify(state.response.body)).to.eq(status);
});

Then("a resposta deve conter a mensagem {string}", (mensagem) => {
  expect(state.response.body.message).to.eq(mensagem);
});

Then("a resposta deve respeitar o contrato de {string}", (contrato) => {
  validarContrato(contrato, state.response.body);
});

Then("a resposta deve apontar o erro {string} no campo {string}", (mensagem, campo) => {
  expect(state.response.body).to.have.property(campo, mensagem);
});

Then("a resposta deve apontar como obrigatórios os campos:", (tabela) => {
  const campos = tabela.raw().flat();
  campos.forEach((campo) => {
    expect(state.response.body).to.have.property(campo, `${campo} é obrigatório`);
  });
  expect(Object.keys(state.response.body)).to.have.members(campos);
});
