import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { lojaPage } from "../pages/loja_page";
import { listaComprasPage } from "../pages/lista_compras_page";
import { nomeProdutoUnico } from "../factories/produto";
import { criarUsuario, autenticarPelaApi } from "../massa_de_dados";
import { state } from "./hooks";

Given("que estou autenticado na loja como um usuário comum", () => {
  criarUsuario().then((usuario) => {
    state.usuarioComum = usuario;
    autenticarPelaApi(usuario);
    lojaPage.visitar();
  });
});

Given("que o produto cadastrado está na lista de compras", () => {
  lojaPage.pesquisar(state.produto.nome);
  lojaPage.adicionarNaLista(state.produto.nome);
  listaComprasPage.deveSerAPaginaAtual();
  listaComprasPage.deveExibirProduto(state.produto, 1);
});

When("pesquiso pelo nome do produto cadastrado", () => {
  lojaPage.pesquisar(state.produto.nome);
});

When("pesquiso por um produto inexistente", () => {
  lojaPage.pesquisar(nomeProdutoUnico());
});

When("adiciono o produto cadastrado à lista de compras", () => {
  lojaPage.adicionarNaLista(state.produto.nome);
});

When("aumento a quantidade do produto {int} vezes", (vezes) => {
  listaComprasPage.aumentarQuantidade(vezes);
});

When("diminuo a quantidade do produto {int} vez", (vezes) => {
  listaComprasPage.diminuirQuantidade(vezes);
});

When("limpo a lista de compras", () => {
  listaComprasPage.limpar();
});

Then("a vitrine deve exibir somente esse produto com o seu preço", () => {
  lojaPage.deveExibirSomenteOProduto(state.produto);
});

Then("a vitrine deve informar que nenhum produto foi encontrado", () => {
  lojaPage.deveInformarQueNadaFoiEncontrado();
});

Then("devo ser direcionado para a lista de compras", () => {
  listaComprasPage.deveSerAPaginaAtual();
});

Then("a lista deve exibir o produto cadastrado com o seu preço e total de {int} unidade", (total) => {
  listaComprasPage.deveExibirProduto(state.produto, total);
});

Then("a lista deve exibir o total de {int} unidades", (total) => {
  listaComprasPage.deveExibirTotal(total);
});

Then("a lista deve informar que está vazia", () => {
  listaComprasPage.deveEstarVazia();
});
