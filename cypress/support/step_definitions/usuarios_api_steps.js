import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { usuariosApi } from "../api/usuarios_api";
import { loginApi } from "../api/login_api";
import { construirUsuario } from "../factories/usuario";
import { validarContrato } from "../contracts";
import { cleanup } from "../cleanup";
import { state } from "./hooks";

const ID_INEXISTENTE = "0000000000000000";

// Cadastra e guarda a resposta; se o cadastro for aceito, agenda a exclusão
// para remover a massa criada pelo cenário na base pública.
function cadastrarUsuario(usuario) {
  usuariosApi.cadastrar(usuario).then((resposta) => {
    state.response = resposta;
    if (resposta.status === 201) {
      cleanup.registrarUsuario(resposta.body._id);
    }
  });
}

When("cadastro um novo usuário via API", () => {
  state.usuario = construirUsuario();
  cadastrarUsuario(state.usuario);
});

When("tento cadastrar outro usuário com o mesmo e-mail", () => {
  cadastrarUsuario(construirUsuario({ email: state.usuario.email }));
});

When("tento cadastrar um usuário com o campo {string} igual a {string}", (campo, valor) => {
  cadastrarUsuario(construirUsuario({ [campo]: valor }));
});

When("tento cadastrar um usuário sem informar nenhum campo", () => {
  cadastrarUsuario({});
});

When("altero o nome e a senha desse usuário via API", () => {
  const { _id, ...dadosAtuais } = state.usuario;
  state.usuarioAlterado = {
    ...dadosAtuais,
    nome: `${dadosAtuais.nome} Alterado`,
    password: `${dadosAtuais.password}-alterada`,
  };
  usuariosApi.editar(_id, state.usuarioAlterado).then((resposta) => {
    state.response = resposta;
  });
});

When("excluo esse usuário via API", () => {
  usuariosApi.excluir(state.usuario._id).then((resposta) => {
    state.response = resposta;
  });
});

When("consulto um usuário com id inexistente", () => {
  usuariosApi.buscarPorId(ID_INEXISTENTE).then((resposta) => {
    state.response = resposta;
  });
});

Then("o usuário deve ser consultável pelo id retornado com os dados cadastrados", () => {
  const { _id } = state.response.body;
  usuariosApi.buscarPorId(_id).then((resposta) => {
    expect(resposta.status).to.eq(200);
    validarContrato("usuario", resposta.body);
    expect(resposta.body).to.deep.equal({ ...state.usuario, _id });
  });
});

Then("a consulta do usuário deve refletir os dados alterados", () => {
  usuariosApi.buscarPorId(state.usuario._id).then((resposta) => {
    expect(resposta.status).to.eq(200);
    validarContrato("usuario", resposta.body);
    expect(resposta.body).to.deep.equal({ ...state.usuarioAlterado, _id: state.usuario._id });
  });
  const { email, password } = state.usuarioAlterado;
  loginApi.autenticar({ email, password }).then((resposta) => {
    expect(resposta.status, "autenticação com a senha alterada").to.eq(200);
    validarContrato("login com sucesso", resposta.body);
  });
  loginApi.autenticar({ email, password: state.usuario.password }).then((resposta) => {
    expect(resposta.status, "rejeição da senha anterior").to.eq(401);
    expect(resposta.body).to.deep.equal({ message: "Email e/ou senha inválidos" });
  });
});

Then("a consulta do usuário deve responder 400 com a mensagem {string}", (mensagem) => {
  usuariosApi.buscarPorId(state.usuario._id).then((resposta) => {
    expect(resposta.status).to.eq(400);
    expect(resposta.body.message).to.eq(mensagem);
  });
});
