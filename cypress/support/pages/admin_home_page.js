// Área administrativa (/admin/home), visível para administradores autenticados.
const seletores = {
  boasVindas: "h1",
  cadastrarUsuarios: "[data-testid=cadastrarUsuarios]",
  listarProdutos: "[data-testid=listarProdutos]",
};

export const adminHomePage = {
  deveSerAPaginaAtual() {
    cy.location("pathname").should("eq", "/admin/home");
    cy.get(seletores.cadastrarUsuarios).should("be.visible");
    cy.get(seletores.listarProdutos).should("be.visible");
  },

  // O front renderiza a saudação com um espaço duplo antes do nome
  // (ver docs/OBSERVACOES.md); a asserção normaliza os espaços para validar
  // o conteúdo sem depender desse detalhe de formatação.
  deveDarBoasVindasA(nome) {
    cy.get(seletores.boasVindas).should(($titulo) => {
      const saudacao = $titulo.text().replace(/\s+/g, " ").trim();
      expect(saudacao).to.eq(`Bem Vindo ${nome}`);
    });
  },
};
