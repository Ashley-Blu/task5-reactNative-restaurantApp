import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as cartApi from "../api/cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const canUseBackendForMenuItemId = (id: unknown) => {
    if (typeof id === "number") return Number.isFinite(id);
    if (typeof id !== "string") return false;
    const n = Number(id);
    return Number.isFinite(n) && String(n) === id.trim();
  };

  const loadLocalCart = async () => {
    const stored = await AsyncStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
  };

  const persistLocalCart = async (next: CartItem[]) => {
    setItems(next);
    await AsyncStorage.setItem("cart", JSON.stringify(next));
  };

  // 🔹 LOAD CART (backend if logged in; otherwise local)
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          await loadLocalCart();
          return;
        }

        const res = await cartApi.getCart();
        const backendItems = (res.data.items || []).map((item: any) => ({
          id: String(item.menu_item_id),
          name: item.menu_item_name,
          price: Number(item.price),
          image: item.image ? { uri: item.image } : undefined,
          quantity: Number(item.quantity),
        }));

        setItems(backendItems);
      } catch (err) {
        await loadLocalCart();
      }
    })();
  }, []);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const backendOk = token && canUseBackendForMenuItemId(item.id);

      if (!backendOk) {
        const next = (() => {
          const existing = items.find((i) => i.id === item.id);
          if (existing) {
            return items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...items, { ...item, quantity: 1 }];
        })();
        await persistLocalCart(next);
        return;
      }

      await cartApi.addToCart(String(item.id), 1);
      const res = await cartApi.getCart();
      const backendItems = (res.data.items || []).map((it: any) => ({
        id: String(it.menu_item_id),
        name: it.menu_item_name,
        price: Number(it.price),
        image: it.image ? { uri: it.image } : undefined,
        quantity: Number(it.quantity),
      }));
      setItems(backendItems);
    } catch (err) {
      const next = (() => {
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          return items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...items, { ...item, quantity: 1 }];
      })();
      await persistLocalCart(next);
    }
  };

  const increase = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !canUseBackendForMenuItemId(id)) {
        const next = items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
        await persistLocalCart(next);
        return;
      }

      const res = await cartApi.getCart();
      const backendItem = (res.data.items || []).find(
        (i: any) => String(i.menu_item_id) === id,
      );
      if (backendItem) {
        await cartApi.updateCartItem(backendItem.id, backendItem.quantity + 1);
        // Refetch cart
        const res2 = await cartApi.getCart();
        const backendItems = (res2.data.items || []).map((it: any) => ({
          id: String(it.menu_item_id),
          name: it.menu_item_name,
          price: Number(it.price),
          image: it.image ? { uri: it.image } : undefined,
          quantity: Number(it.quantity),
        }));
        setItems(backendItems);
      }
    } catch (err) {
      const next = items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      await persistLocalCart(next);
    }
  };

  const decrease = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !canUseBackendForMenuItemId(id)) {
        const next = items
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0);
        await persistLocalCart(next);
        return;
      }

      const res = await cartApi.getCart();
      const backendItem = (res.data.items || []).find(
        (i: any) => String(i.menu_item_id) === id,
      );
      if (backendItem) {
        if (backendItem.quantity > 1) {
          await cartApi.updateCartItem(
            backendItem.id,
            backendItem.quantity - 1,
          );
        } else {
          await cartApi.deleteCartItem(backendItem.id);
        }
        // Refetch cart
        const res2 = await cartApi.getCart();
        const backendItems = (res2.data.items || []).map((it: any) => ({
          id: String(it.menu_item_id),
          name: it.menu_item_name,
          price: Number(it.price),
          image: it.image ? { uri: it.image } : undefined,
          quantity: Number(it.quantity),
        }));
        setItems(backendItems);
      }
    } catch (err) {
      const next = items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
      await persistLocalCart(next);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increase,
        decrease,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
