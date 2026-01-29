import api from "./api";

export const login = (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const register = (data: any) => {
  return api.post("/auth/register", data);
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const logout = () => {
  return api.post("/auth/logout");
};