import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../pages/login_page";
import { lojaPage } from "../pages/loja_page";
import { adminHomePage } from "../pages/admin_home_page";
import { emailUnico } from "../factories/usuario";
import { criarAdministrador } from "../massa_de_dados";
import { state } from "./hooks";

const CHAVES_DE_SESSAO = [
  "serverest/userToken",
  "serverest/userEmail",
  "serverest/userPassword",
];

Given("que estou na página de login", () => {
  loginPage.visitar();
});

Given("que existe um administrador cadastrado", () => {
  criarAdministrador().then((administrador) => {
    state.administrador = administrador;
  });
});

When("informo as credenciais desse administrador e entro", () => {
  loginPage.autenticar(state.administrador.email, state.administrador.password);
});

Given("que informo as credenciais desse usuário e entro", () => {
  loginPage.autenticar(state.usuario.email, state.usuario.password);
  lojaPage.deveSerAPaginaAtual();
});

When("informo as credenciais desse usuário e entro", () => {
  loginPage.autenticar(state.usuario.email, state.usuario.password);
});

When("informo o e-mail desse usuário com uma senha incorreta e entro", () => {
  loginPage.autenticar(state.usuario.email, `${state.usuario.password}-incorreta`);
});

When("informo um e-mail não cadastrado e entro", () => {
  loginPage.autenticar(emailUnico("inexistente"), "qualquer-senha");
});

When("entro sem preencher nenhum campo", () => {
  loginPage.entrar();
});

When("encerro a sessão", () => {
  lojaPage.encerrarSessao();
});

Then("a área administrativa deve dar boas-vindas ao administrador pelo nome", () => {
  adminHomePage.deveDarBoasVindasA(state.administrador.nome);
});

Then("a loja deve exibir a vitrine de produtos", () => {
  lojaPage.deveExibirVitrine(state.produto);
});

Then("devo permanecer na página de login", () => {
  loginPage.deveSerAPaginaAtual();
});

Then("a sessão não deve mais estar armazenada no navegador", () => {
  cy.window().should((janela) => {
    CHAVES_DE_SESSAO.forEach((chave) => {
      expect(janela.localStorage.getItem(chave), chave).to.be.null;
    });
  });
});
