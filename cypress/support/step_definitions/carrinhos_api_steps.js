import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { carrinhosApi } from "../api/carrinhos_api";
import { produtosApi } from "../api/produtos_api";
import { validarContrato } from "../contracts";
import { cleanup } from "../cleanup";
import { criarCarrinho } from "../massa_de_dados";
import { state } from "./hooks";

const PRODUTO_INEXISTENTE = "0000000000000000";

function cadastrarCarrinho(produtos, token) {
  carrinhosApi.cadastrar(produtos, token).then((resposta) => {
    state.response = resposta;
    if (resposta.status === 201) {
      state.carrinhoId = resposta.body._id;
      cleanup.registrarCarrinho(resposta.body._id, token);
    }
  });
}

Given("que o usuário comum já possui um carrinho com {int} unidade(s) do produto", (quantidade) => {
  criarCarrinho(state.tokenComum, [{ idProduto: state.produto._id, quantidade }]).then(
    (carrinhoId) => {
      state.carrinhoId = carrinhoId;
    }
  );
});

When("o usuário comum cria um carrinho com {int} unidade(s) do produto", (quantidade) => {
  cadastrarCarrinho([{ idProduto: state.produto._id, quantidade }], state.tokenComum);
});

When("o usuário comum cria um carrinho com um produto inexistente", () => {
  cadastrarCarrinho([{ idProduto: PRODUTO_INEXISTENTE, quantidade: 1 }], state.tokenComum);
});

When("tento criar um carrinho sem informar o token", () => {
  cadastrarCarrinho([{ idProduto: state.produto._id, quantidade: 1 }], undefined);
});

When("o usuário comum cancela a compra", () => {
  carrinhosApi.cancelarCompra(state.tokenComum).then((resposta) => {
    state.response = resposta;
  });
});

When("o usuário comum conclui a compra", () => {
  carrinhosApi.concluirCompra(state.tokenComum).then((resposta) => {
    state.response = resposta;
  });
});

Then(
  "o carrinho consultado deve ter {int} unidades do produto e o total calculado pelo preço unitário",
  (quantidade) => {
    const { produto, usuarioComum } = state;
    carrinhosApi.buscarPorId(state.carrinhoId).then((resposta) => {
      expect(resposta.status).to.eq(200);
      validarContrato("carrinho", resposta.body);
      expect(resposta.body).to.deep.equal({
        _id: state.carrinhoId,
        idUsuario: usuarioComum._id,
        produtos: [{ idProduto: produto._id, quantidade, precoUnitario: produto.preco }],
        precoTotal: produto.preco * quantidade,
        quantidadeTotal: quantidade,
      });
    });
  }
);

Then("o estoque do produto deve ser de {int} unidades", (estoque) => {
  produtosApi.buscarPorId(state.produto._id).then((resposta) => {
    expect(resposta.status).to.eq(200);
    expect(resposta.body.quantidade, "estoque do produto").to.eq(estoque);
  });
});

Then("o carrinho não deve mais existir", () => {
  carrinhosApi.buscarPorId(state.carrinhoId).then((resposta) => {
    expect(resposta.status).to.eq(400);
    expect(resposta.body.message).to.eq("Carrinho não encontrado");
  });
});
