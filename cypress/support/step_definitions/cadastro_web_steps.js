import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { cadastroPage } from "../pages/cadastro_page";
import { usuariosApi } from "../api/usuarios_api";
import { construirUsuario, construirAdministrador } from "../factories/usuario";
import { cleanup } from "../cleanup";
import { validarContrato } from "../contracts";
import { state } from "./hooks";

// O cadastro pelo site cria um usuário real na API; a limpeza localiza o
// registro pelo e-mail (único por execução) e o exclui ao final do cenário.
function preencherCadastro(usuario) {
  state.novoUsuario = usuario;
  cleanup.registrarUsuarioPorEmail(usuario.email);
  cadastroPage.preencher(usuario);
}

Given("que estou na página de cadastro", () => {
  cadastroPage.visitar();
});

When("preencho o cadastro com os dados de um novo usuário comum", () => {
  preencherCadastro(construirUsuario());
});

When("preencho o cadastro com os dados de um novo administrador", () => {
  preencherCadastro(construirAdministrador());
});

When("preencho o cadastro reutilizando o e-mail desse usuário", () => {
  cadastroPage.preencher(construirUsuario({ email: state.usuario.email }));
});

When("confirmo o cadastro", () => {
  cadastroPage.confirmar();
});

When("confirmo o cadastro sem preencher nenhum campo", () => {
  cadastroPage.confirmar();
});

Then("devo permanecer na página de cadastro", () => {
  cadastroPage.deveSerAPaginaAtual();
});

Then("o usuário cadastrado deve existir na API como usuário comum", () => {
  usuarioDeveExistirNaApi("false");
});

Then("o usuário cadastrado deve existir na API como administrador", () => {
  usuarioDeveExistirNaApi("true");
});

function usuarioDeveExistirNaApi(administrador) {
  const { nome, email, password } = state.novoUsuario;
  usuariosApi.listar({ email }).then((resposta) => {
    expect(resposta.status).to.eq(200);
    validarContrato("lista de usuários", resposta.body);
    expect(resposta.body.quantidade, "usuários com o e-mail cadastrado").to.eq(1);
    expect(resposta.body.usuarios[0]).to.include({ nome, email, password, administrador });
  });
}
