// Contratos das respostas da API, derivados do Swagger (https://serverest.dev)
// e do comportamento observado. `additionalProperties: false` garante que um
// campo novo ou renomeado seja detectado.

const ID_PATTERN = "^[A-Za-z0-9]{16}$";

const mensagem = {
  type: "object",
  required: ["message"],
  additionalProperties: false,
  properties: { message: { type: "string", minLength: 1 } },
};

const cadastroComSucesso = {
  type: "object",
  required: ["message", "_id"],
  additionalProperties: false,
  properties: {
    message: { type: "string", const: "Cadastro realizado com sucesso" },
    _id: { type: "string", pattern: ID_PATTERN },
  },
};

const loginComSucesso = {
  type: "object",
  required: ["message", "authorization"],
  additionalProperties: false,
  properties: {
    message: { type: "string", const: "Login realizado com sucesso" },
    authorization: {
      type: "string",
      pattern: "^Bearer [A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$",
    },
  },
};

const usuario = {
  type: "object",
  required: ["nome", "email", "password", "administrador", "_id"],
  additionalProperties: false,
  properties: {
    nome: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 1 },
    administrador: { type: "string", enum: ["true", "false"] },
    _id: { type: "string", pattern: ID_PATTERN },
  },
};

const listaUsuarios = {
  type: "object",
  required: ["quantidade", "usuarios"],
  additionalProperties: false,
  properties: {
    quantidade: { type: "integer", minimum: 0 },
    usuarios: { type: "array", items: usuario },
  },
};

const produto = {
  type: "object",
  required: ["nome", "preco", "descricao", "quantidade", "_id"],
  additionalProperties: false,
  properties: {
    nome: { type: "string", minLength: 1 },
    preco: { type: "integer", minimum: 1 },
    descricao: { type: "string", minLength: 1 },
    quantidade: { type: "integer", minimum: 0 },
    _id: { type: "string", pattern: ID_PATTERN },
  },
};

const listaProdutos = {
  type: "object",
  required: ["quantidade", "produtos"],
  additionalProperties: false,
  properties: {
    quantidade: { type: "integer", minimum: 0 },
    produtos: { type: "array", items: produto },
  },
};

const carrinho = {
  type: "object",
  required: ["produtos", "precoTotal", "quantidadeTotal", "idUsuario", "_id"],
  additionalProperties: false,
  properties: {
    produtos: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["idProduto", "quantidade", "precoUnitario"],
        additionalProperties: false,
        properties: {
          idProduto: { type: "string", pattern: ID_PATTERN },
          quantidade: { type: "integer", minimum: 1 },
          precoUnitario: { type: "integer", minimum: 1 },
        },
      },
    },
    precoTotal: { type: "integer", minimum: 1 },
    quantidadeTotal: { type: "integer", minimum: 1 },
    idUsuario: { type: "string", pattern: ID_PATTERN },
    _id: { type: "string", pattern: ID_PATTERN },
  },
};

export const schemas = {
  mensagem,
  "cadastro com sucesso": cadastroComSucesso,
  "login com sucesso": loginComSucesso,
  usuario,
  "lista de usuários": listaUsuarios,
  produto,
  "lista de produtos": listaProdutos,
  carrinho,
};
