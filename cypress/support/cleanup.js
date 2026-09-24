import { usuariosApi } from "./api/usuarios_api";
import { produtosApi } from "./api/produtos_api";
import { carrinhosApi } from "./api/carrinhos_api";
import { validarContrato } from "./contracts";

// Registro de limpeza por cenário. A execução em ordem inversa (LIFO)
// respeita as dependências: carrinho antes de produto, produto antes de usuário.
const tarefas = [];

function validarExclusao(
  resposta,
  recurso,
  mensagemJaAusente = "Nenhum registro excluído",
  mensagemSucesso = "Registro excluído com sucesso"
) {
  expect(resposta.status, `limpeza: exclusão de ${recurso}`).to.eq(200);
  expect(resposta.body, `limpeza: resposta de exclusão de ${recurso}`).to.have.all.keys("message");
  expect(resposta.body.message, `limpeza: resultado de exclusão de ${recurso}`).to.be.oneOf([
    mensagemSucesso,
    mensagemJaAusente,
  ]);
}

function validarAusencia(resposta, recurso, mensagem) {
  expect(resposta.status, `limpeza: ausência de ${recurso}`).to.eq(400);
  expect(resposta.body, `limpeza: consulta de ${recurso}`).to.deep.equal({ message: mensagem });
}

function excluirUsuario(id) {
  return usuariosApi.excluir(id).then((resposta) => {
    validarExclusao(resposta, `usuário ${id}`);
    return usuariosApi.buscarPorId(id);
  }).then((resposta) => {
    validarAusencia(resposta, `usuário ${id}`, "Usuário não encontrado");
  });
}

export const cleanup = {
  registrarUsuario(id) {
    expect(id, "limpeza: id do usuário criado").to.be.a("string").and.not.be.empty;
    tarefas.push(() => excluirUsuario(id));
  },
  registrarProduto(id, token) {
    expect(id, "limpeza: id do produto criado").to.be.a("string").and.not.be.empty;
    tarefas.push(() => produtosApi.excluir(id, token).then((resposta) => {
      validarExclusao(resposta, `produto ${id}`);
      return produtosApi.buscarPorId(id);
    }).then((resposta) => {
      validarAusencia(resposta, `produto ${id}`, "Produto não encontrado");
    }));
  },
  registrarCarrinho(id, token) {
    expect(id, "limpeza: id do carrinho criado").to.be.a("string").and.not.be.empty;
    tarefas.push(() => carrinhosApi.cancelarCompra(token).then((resposta) => {
      validarExclusao(
        resposta,
        `carrinho ${id}`,
        "Não foi encontrado carrinho para esse usuário",
        "Registro excluído com sucesso. Estoque dos produtos reabastecido"
      );
      return carrinhosApi.buscarPorId(id);
    }).then((resposta) => {
      validarAusencia(resposta, `carrinho ${id}`, "Carrinho não encontrado");
    }));
  },
  registrarUsuarioPorEmail(email) {
    tarefas.push(() => usuariosApi.listar({ email }).then((resposta) => {
      expect(resposta.status, "limpeza: consulta do usuário pelo e-mail").to.eq(200);
      validarContrato("lista de usuários", resposta.body);
      expect(resposta.body.quantidade).to.eq(resposta.body.usuarios.length);
      resposta.body.usuarios.forEach((usuario) => {
        expect(usuario.email, "limpeza: e-mail do registro encontrado").to.eq(email);
      });
      resposta.body.usuarios.forEach((usuario) => excluirUsuario(usuario._id));
    }));
  },
  executar() {
    while (tarefas.length > 0) {
      tarefas.pop()();
    }
  },
  limpar() {
    tarefas.length = 0;
  },
};
