import { faker } from "@faker-js/faker/locale/pt_BR";

// O nome recebe um sufixo único porque a API rejeita nomes duplicados e a base
// pública é compartilhada com outros usuários.
export const nomeProdutoUnico = () =>
  `${faker.commerce.productName()} ${Date.now()}-${faker.string.alphanumeric(4).toLowerCase()}`;

export const construirProduto = (sobrescritas = {}) => ({
  nome: nomeProdutoUnico(),
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 5, max: 100 }),
  ...sobrescritas,
});
