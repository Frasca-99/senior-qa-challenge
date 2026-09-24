// Vitrine da loja (/home), visível para usuários comuns autenticados.
const seletores = {
  titulo: "h1",
  pesquisar: "[data-testid=pesquisar]",
  botaoPesquisar: "[data-testid=botaoPesquisar]",
  cartao: ".card",
  nomeProduto: ".card-title",
  precoProduto: ".card-subtitle:not(.negrito)",
  adicionarNaLista: "[data-testid=adicionarNaLista]",
  logout: "[data-testid=logout]",
};

const MENSAGEM_SEM_PRODUTOS = "Nenhum produto foi encontrado";

export const lojaPage = {
  visitar() {
    cy.visit("/home");
    this.deveSerAPaginaAtual();
  },

  deveSerAPaginaAtual() {
    cy.location("pathname").should("eq", "/home");
    cy.get(seletores.titulo).should("contain.text", "Serverest Store");
  },

  deveExibirVitrine({ nome }) {
    cy.get(seletores.pesquisar).should("be.visible");
    this.cartaoDoProduto(nome).should("be.visible");
  },

  pesquisar(termo) {
    cy.get(seletores.pesquisar).clear();
    cy.get(seletores.pesquisar).type(termo);
    cy.get(seletores.botaoPesquisar).click();
  },

  cartaoDoProduto(nome) {
    const nomeExato = new RegExp(`^${Cypress._.escapeRegExp(nome)}$`);
    return cy.contains(seletores.nomeProduto, nomeExato).closest(seletores.cartao);
  },

  deveExibirSomenteOProduto({ nome, preco }) {
    cy.get(seletores.cartao).should("have.length", 1);
    this.cartaoDoProduto(nome)
      .find(seletores.precoProduto)
      .should("have.length", 1)
      .and("be.visible")
      .and("have.text", `$ ${preco}`);
  },

  deveInformarQueNadaFoiEncontrado() {
    cy.get(seletores.cartao).should("not.exist");
    cy.contains(MENSAGEM_SEM_PRODUTOS).should("be.visible");
  },

  adicionarNaLista(nome) {
    this.cartaoDoProduto(nome).find(seletores.adicionarNaLista).click();
  },

  encerrarSessao() {
    cy.get(seletores.logout).click();
  },
};
