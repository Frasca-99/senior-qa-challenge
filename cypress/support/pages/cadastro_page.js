const seletores = {
  nome: "[data-testid=nome]",
  email: "[data-testid=email]",
  senha: "[data-testid=password]",
  administrador: "[data-testid=checkbox]",
  cadastrar: "[data-testid=cadastrar]",
};

export const cadastroPage = {
  visitar() {
    cy.visit("/cadastrarusuarios");
    cy.get(seletores.cadastrar).should("be.visible");
  },

  preencher({ nome, email, password, administrador }) {
    cy.get(seletores.nome).type(nome);
    cy.get(seletores.email).type(email);
    cy.get(seletores.senha).type(password, { log: false });
    if (administrador === "true") {
      cy.get(seletores.administrador).check();
    }
  },

  confirmar() {
    cy.get(seletores.cadastrar).click();
  },



  deveSerAPaginaAtual() {
    cy.location("pathname").should("eq", "/cadastrarusuarios");
    cy.get(seletores.cadastrar).should("be.visible");
  },
};
