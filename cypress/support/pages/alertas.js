// Alertas (Bootstrap) exibidos pelo front após validações e chamadas à API.
const seletor = ".alert";

export const alertas = {
  deveConter(mensagem) {
    cy.get(seletor).should("be.visible").and("contain.text", mensagem);
  },

  devemSer(mensagens) {
    cy.get(seletor).should("have.length", mensagens.length);
    mensagens.forEach((mensagem) => {
      cy.contains(seletor, mensagem).should("be.visible");
    });
  },
};
