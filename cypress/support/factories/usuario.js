import { faker } from "@faker-js/faker/locale/pt_BR";

// Massa de dados dinâmica: e-mails únicos por execução evitam colisões entre
// cenários, entre execuções consecutivas e com os dados de terceiros que
// convivem na base pública do ServeRest.
export const emailUnico = (prefixo = "qa") =>
  `${prefixo}.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@serverest-tests.com.br`;

export const construirUsuario = (sobrescritas = {}) => ({
  nome: faker.person.fullName(),
  email: emailUnico(),
  password: faker.internet.password({ length: 12 }),
  administrador: "false",
  ...sobrescritas,
});

export const construirAdministrador = (sobrescritas = {}) =>
  construirUsuario({ administrador: "true", ...sobrescritas });
