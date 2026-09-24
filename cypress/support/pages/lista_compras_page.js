// Lista de compras (/minhaListaDeProdutos): mantida pelo front no navegador.
const seletores = {
  nomeProduto: "[data-testid=shopping-cart-product-name]",
  quantidadeProduto: "[data-testid=shopping-cart-product-quantity]",
  aumentar: "[data-testid=product-increase-quantity]",
  diminuir: "[data-testid=product-decrease-quantity]",
  limparLista: "[data-testid=limparLista]",
  listaVazia: "[data-testid=shopping-cart-empty-message]",
};

export const listaComprasPage = {
  deveSerAPaginaAtual() {
    cy.location("pathname").should("eq", "/minhaListaDeProdutos");
  },

  deveExibirProduto({ nome, preco }, total) {
    cy.get(seletores.nomeProduto)
      .should("have.length", 1)
      .and("be.visible")
      .and("have.text", `Produto:${nome}`)
      .next()
      .children("p")
      .should("have.length", 1)
      .and("be.visible")
      .and("have.text", `Preço R$${preco * total}`);
    this.deveExibirTotal(total);
  },

  deveExibirTotal(total) {
    cy.get(seletores.quantidadeProduto).should("have.text", `Total: ${total}`);
  },

  aumentarQuantidade(vezes) {
    Cypress._.times(vezes, () => cy.get(seletores.aumentar).click());
  },

  diminuirQuantidade(vezes) {
    Cypress._.times(vezes, () => cy.get(seletores.diminuir).click());
  },

  limpar() {
    cy.get(seletores.limparLista).click();
  },

  deveEstarVazia() {
    cy.get(seletores.listaVazia).should("be.visible").and("have.text", "Seu carrinho está vazio");
    cy.get(seletores.nomeProduto).should("not.exist");
  },
};
