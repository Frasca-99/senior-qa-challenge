import { apiRequest } from "./client";

export const carrinhosApi = {
  cadastrar(produtos, token) {
    return apiRequest({ method: "POST", path: "/carrinhos", body: { produtos }, token });
  },
  buscarPorId(id) {
    return apiRequest({ path: `/carrinhos/${id}` });
  },
  concluirCompra(token) {
    return apiRequest({ method: "DELETE", path: "/carrinhos/concluir-compra", token });
  },
  cancelarCompra(token) {
    return apiRequest({ method: "DELETE", path: "/carrinhos/cancelar-compra", token });
  },
};
