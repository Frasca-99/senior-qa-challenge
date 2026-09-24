const seletores = {
  email: "[data-testid=email]",
  senha: "[data-testid=senha]",
  entrar: "[data-testid=entrar]",
};

export const loginPage = {
  visitar() {
    cy.visit("/login");
    cy.get(seletores.entrar).should("be.visible");
  },

  autenticar(email, senha) {
    cy.get(seletores.email).clear();
    cy.get(seletores.email).type(email);
    cy.get(seletores.senha).clear();
    cy.get(seletores.senha).type(senha, { log: false });
    this.entrar();
  },

  entrar() {
    cy.get(seletores.entrar).click();
  },


  deveSerAPaginaAtual() {
    cy.location("pathname").should("eq", "/login");
    cy.get(seletores.entrar).should("be.visible");
  },
};
