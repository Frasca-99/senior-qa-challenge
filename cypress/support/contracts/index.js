import Ajv from "ajv";
import addFormats from "ajv-formats";
import { schemas } from "./schemas";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const validators = Object.fromEntries(
  Object.entries(schemas).map(([nome, schema]) => [nome, ajv.compile(schema)])
);

export function validarContrato(nome, dados) {
  const validar = validators[nome];
  expect(validar, `contrato "${nome}" cadastrado`).to.exist;

  const valido = validar(dados);
  const detalhes = (validar.errors || [])
    .map((erro) => `${erro.instancePath || "(raiz)"} ${erro.message}`)
    .join("; ");
  expect(valido, `contrato "${nome}"${detalhes ? `: ${detalhes}` : ""}`).to.be.true;
}
