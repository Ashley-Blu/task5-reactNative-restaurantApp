import api from "./api";

export const getCart = () => api.get("/cart");
export const addToCart = (menu_item_id: string, quantity: number = 1) =>
  api.post("/cart", { menu_item_id, quantity });
export const updateCartItem = (cartItemId: string, quantity: number) =>
  api.put(`/cart/item/${cartItemId}`, { quantity });
export const deleteCartItem = (cartItemId: string) =>
  api.delete(`/cart/item/${cartItemId}`);
export const clearCart = (cartId: string) =>
  api.delete(`/cart/clear/${cartId}`);
