import { apiRequest } from "./client";

export const loginApi = {
  autenticar(credenciais) {
    return apiRequest({ method: "POST", path: "/login", body: credenciais });
  },
};
