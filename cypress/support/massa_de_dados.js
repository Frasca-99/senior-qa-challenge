import { usuariosApi } from "./api/usuarios_api";
import { loginApi } from "./api/login_api";
import { produtosApi } from "./api/produtos_api";
import { carrinhosApi } from "./api/carrinhos_api";
import { construirUsuario } from "./factories/usuario";
import { construirProduto } from "./factories/produto";
import { cleanup } from "./cleanup";

// Pré-condições dos cenários: criam massa de dados pela API e agendam a sua
// remoção ao final do cenário. As asserções aqui são de pré-condição — se
// falharem, o cenário é inválido, não o comportamento sob teste.
//
// Este módulo é importado apenas pelas step definitions (e não por um support
// file) de propósito: o Cypress empacota o support file e a spec em bundles
// separados, e o registro de limpeza precisa ser uma única instância.

export function criarUsuario(sobrescritas = {}) {
  const usuario = construirUsuario(sobrescritas);
  return usuariosApi.cadastrar(usuario).then((resposta) => {
    expect(resposta.status, "pré-condição: cadastro do usuário").to.eq(201);
    cleanup.registrarUsuario(resposta.body._id);
    return { ...usuario, _id: resposta.body._id };
  });
}

export function criarAdministrador(sobrescritas = {}) {
  return criarUsuario({ administrador: "true", ...sobrescritas });
}

export function obterToken({ email, password }) {
  return loginApi.autenticar({ email, password }).then((resposta) => {
    expect(resposta.status, "pré-condição: autenticação").to.eq(200);
    return resposta.body.authorization;
  });
}

export function criarProduto(token, sobrescritas = {}) {
  const produto = construirProduto(sobrescritas);
  return produtosApi.cadastrar(produto, token).then((resposta) => {
    expect(resposta.status, "pré-condição: cadastro do produto").to.eq(201);
    cleanup.registrarProduto(resposta.body._id, token);
    return { ...produto, _id: resposta.body._id };
  });
}

export function criarCarrinho(token, produtos) {
  return carrinhosApi.cadastrar(produtos, token).then((resposta) => {
    expect(resposta.status, "pré-condição: cadastro do carrinho").to.eq(201);
    cleanup.registrarCarrinho(resposta.body._id, token);
    return resposta.body._id;
  });
}

// Sessão autenticada sem passar pela tela de login, para cenários Web cujo
// objetivo não é o login em si. Replica o que o front persiste após autenticar.
export function autenticarPelaApi(usuario) {
  return obterToken(usuario).then((token) => {
    window.localStorage.setItem("serverest/userToken", token);
    window.localStorage.setItem("serverest/userEmail", usuario.email);
  });
}
