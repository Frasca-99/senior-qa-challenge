import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginApi } from "../api/login_api";
import { carrinhosApi } from "../api/carrinhos_api";
import { produtosApi } from "../api/produtos_api";
import { emailUnico } from "../factories/usuario";
import { construirProduto } from "../factories/produto";
import { state } from "./hooks";

const TOKEN_INVALIDO = "Bearer token.invalido.qa";

function autenticar(credenciais) {
  loginApi.autenticar(credenciais).then((resposta) => {
    state.response = resposta;
  });
}

When("faço login via API com as credenciais desse usuário", () => {
  const { email, password } = state.usuario;
  autenticar({ email, password });
});

When("faço login via API com a senha incorreta", () => {
  const { email, password } = state.usuario;
  autenticar({ email, password: `${password}-incorreta` });
});

When("faço login via API com um e-mail não cadastrado", () => {
  autenticar({ email: emailUnico("inexistente"), password: "qualquer-senha" });
});

When("faço login via API sem informar e-mail nem senha", () => {
  autenticar({});
});

When("tento cadastrar um produto com um token inválido", () => {
  produtosApi.cadastrar(construirProduto(), TOKEN_INVALIDO).then((resposta) => {
    state.response = resposta;
  });
});

// A rota de cancelar compra exige apenas autenticação (não exige perfil de
// administrador) e é idempotente para quem não tem carrinho — serve para
// provar que o token é aceito sem produzir efeitos colaterais.
Then("o token retornado deve dar acesso a uma rota protegida", () => {
  carrinhosApi.cancelarCompra(state.response.body.authorization).then((resposta) => {
    expect(resposta.status).to.eq(200);
    expect(resposta.body.message).to.eq("Não foi encontrado carrinho para esse usuário");
  });
});
