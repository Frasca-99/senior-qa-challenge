// Cliente HTTP mínimo para a API do ServeRest. Nunca falha por status code:
// cada cenário afirma explicitamente o status esperado, positivo ou negativo.
export function apiRequest({ method = "GET", path, body, qs, token }) {
  return cy.request({
    method,
    url: `${Cypress.expose("apiUrl")}${path}`,
    body,
    qs,
    headers: token ? { Authorization: token } : undefined,
    failOnStatusCode: false,
  });
}
