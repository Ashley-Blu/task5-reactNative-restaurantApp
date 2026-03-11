import axios from "@/app/admin/lib/axios";

export const getMenu = () => axios.get("/admin/menu");

export const getMenuItem = (id: string) => axios.get(`/admin/menu/${id}`);

export const createMenuItem = (data: FormData) =>
  axios.post("/admin/menu", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateMenuItem = (id: string, data: FormData) =>
  axios.put(`/admin/menu/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMenuItem = (id: string) => axios.delete(`/admin/menu/${id}`);
