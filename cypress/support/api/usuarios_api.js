import { apiRequest } from "./client";

export const usuariosApi = {
  cadastrar(usuario) {
    return apiRequest({ method: "POST", path: "/usuarios", body: usuario });
  },
  listar(filtros = {}) {
    return apiRequest({ path: "/usuarios", qs: filtros });
  },
  buscarPorId(id) {
    return apiRequest({ path: `/usuarios/${id}` });
  },
  editar(id, usuario) {
    return apiRequest({ method: "PUT", path: `/usuarios/${id}`, body: usuario });
  },
  excluir(id) {
    return apiRequest({ method: "DELETE", path: `/usuarios/${id}` });
  },
};
