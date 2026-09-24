import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../pages/login_page";
import { lojaPage } from "../pages/loja_page";
import { adminHomePage } from "../pages/admin_home_page";
import { alertas } from "../pages/alertas";

Then("devo ser direcionado para a loja", () => {
  lojaPage.deveSerAPaginaAtual();
});

Then("devo ser direcionado para a área administrativa", () => {
  adminHomePage.deveSerAPaginaAtual();
});

Then("devo ser direcionado para a página de login", () => {
  loginPage.deveSerAPaginaAtual();
});

Then("devo ver o alerta {string}", (mensagem) => {
  alertas.deveConter(mensagem);
});

Then("devo ver os alertas:", (tabela) => {
  alertas.devemSer(tabela.raw().flat());
});
