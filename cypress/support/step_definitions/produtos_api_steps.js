import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { produtosApi } from "../api/produtos_api";
import { construirProduto } from "../factories/produto";
import { validarContrato } from "../contracts";
import { cleanup } from "../cleanup";
import { state } from "./hooks";

const CAMPOS_NUMERICOS = ["preco", "quantidade"];

function cadastrarProduto(produto, token) {
  produtosApi.cadastrar(produto, token).then((resposta) => {
    state.response = resposta;
    if (resposta.status === 201) {
      cleanup.registrarProduto(resposta.body._id, state.tokenAdministrador);
    }
  });
}

When("cadastro um novo produto via API", () => {
  state.produto = construirProduto();
  cadastrarProduto(state.produto, state.tokenAdministrador);
});

When("tento cadastrar um produto sem informar o token", () => {
  cadastrarProduto(construirProduto(), undefined);
});

When("tento cadastrar um produto com o token do usuário comum", () => {
  cadastrarProduto(construirProduto(), state.tokenComum);
});

When("tento cadastrar outro produto com o mesmo nome", () => {
  cadastrarProduto(construirProduto({ nome: state.produto.nome }), state.tokenAdministrador);
});

When("tento cadastrar um produto com o campo {string} igual a {string}", (campo, valor) => {
  const valorTipado = CAMPOS_NUMERICOS.includes(campo) ? Number(valor) : valor;
  cadastrarProduto(construirProduto({ [campo]: valorTipado }), state.tokenAdministrador);
});

When("listo os produtos filtrando pelo nome desse produto", () => {
  produtosApi.listar({ nome: state.produto.nome }).then((resposta) => {
    state.response = resposta;
  });
});

When("excluo esse produto via API", () => {
  produtosApi.excluir(state.produto._id, state.tokenAdministrador).then((resposta) => {
    state.response = resposta;
  });
});

Then("o produto deve ser consultável pelo id retornado com os dados cadastrados", () => {
  const { _id } = state.response.body;
  produtosApi.buscarPorId(_id).then((resposta) => {
    expect(resposta.status).to.eq(200);
    validarContrato("produto", resposta.body);
    expect(resposta.body).to.deep.equal({ ...state.produto, _id });
  });
});

Then("a lista deve conter exatamente o produto cadastrado", () => {
  expect(state.response.body.quantidade).to.eq(1);
  expect(state.response.body.produtos).to.deep.equal([state.produto]);
});

Then("a consulta do produto deve responder 400 com a mensagem {string}", (mensagem) => {
  produtosApi.buscarPorId(state.produto._id).then((resposta) => {
    expect(resposta.status).to.eq(400);
    expect(resposta.body.message).to.eq(mensagem);
  });
});
