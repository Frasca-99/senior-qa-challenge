import { apiRequest } from "./client";

export const produtosApi = {
  cadastrar(produto, token) {
    return apiRequest({ method: "POST", path: "/produtos", body: produto, token });
  },
  listar(filtros = {}) {
    return apiRequest({ path: "/produtos", qs: filtros });
  },
  buscarPorId(id) {
    return apiRequest({ path: `/produtos/${id}` });
  },
  excluir(id, token) {
    return apiRequest({ method: "DELETE", path: `/produtos/${id}`, token });
  },
};
