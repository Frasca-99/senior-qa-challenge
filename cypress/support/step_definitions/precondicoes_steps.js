import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { criarUsuario, criarAdministrador, obterToken, criarProduto } from "../massa_de_dados";
import { state } from "./hooks";

Given("que existe um usuário cadastrado", () => {
  criarUsuario().then((usuario) => {
    state.usuario = usuario;
  });
});

Given("que existe um administrador autenticado", () => {
  criarAdministrador().then((administrador) => {
    state.administrador = administrador;
    obterToken(administrador).then((token) => {
      state.tokenAdministrador = token;
    });
  });
});

Given("que existe um usuário comum autenticado", () => {
  criarUsuario().then((usuario) => {
    state.usuarioComum = usuario;
    obterToken(usuario).then((token) => {
      state.tokenComum = token;
    });
  });
});

Given("que existe um produto cadastrado", () => {
  criarProduto(state.tokenAdministrador).then((produto) => {
    state.produto = produto;
  });
});

Given("que existe um produto cadastrado com estoque de {int} unidades", (estoque) => {
  criarProduto(state.tokenAdministrador, { quantidade: estoque }).then((produto) => {
    state.produto = produto;
  });
});
