import api from "./api";

export const getProfile = () => api.get("/user/me");

export const updateProfile = (data: any) =>
  api.put("/user/me", data);

export const getOrderHistory = () =>
  api.get("/orders/my");
