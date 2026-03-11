// admin-dashboard/lib/menu.ts

import axios from "./axios";

export type MenuPayload = {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category_id: number;
  featured?: boolean;
  special?: boolean;
};

export const getMenu = () => axios.get("/menu");
export const getMenuItem = (id: string) => axios.get(`/menu/${id}`);

export const createMenuItem = (data: MenuPayload) =>
  axios.post("/menu", data);

export const updateMenuItem = (id: string, data: Partial<MenuPayload>) =>
  axios.put(`/menu/${id}`, data);

export const deleteMenuItem = (id: string) => axios.delete(`/menu/${id}`);

// Category CRUD
export const getCategories = () => axios.get("/categories");
export const getCategory = (id: string) => axios.get(`/categories/${id}`);
export const createCategory = (data: { name: string }) =>
  axios.post("/categories", data);
export const updateCategory = (id: string, data: { name: string }) =>
  axios.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => axios.delete(`/categories/${id}`);
