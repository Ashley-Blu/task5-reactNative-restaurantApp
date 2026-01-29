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

  // 🔹 LOAD CART FROM BACKEND
  useEffect(() => {
    (async () => {
      try {
        const res = await cartApi.getCart();
        // Map backend cart items to local CartItem shape
        const backendItems = (res.data.items || []).map((item: any) => ({
          id: item.menu_item_id,
          name: item.menu_item_name,
          price: item.price,
          image: { uri: item.image },
          quantity: item.quantity,
        }));
        setItems(backendItems);
      } catch (err) {
        // fallback: load from local storage if backend fails
        const stored = await AsyncStorage.getItem("cart");
        if (stored) setItems(JSON.parse(stored));
      }
    })();
  }, []);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    try {
      await cartApi.addToCart(item.id, 1);
      // Refetch cart from backend
      const res = await cartApi.getCart();
      const backendItems = (res.data.items || []).map((item: any) => ({
        id: item.menu_item_id,
        name: item.menu_item_name,
        price: item.price,
        image: { uri: item.image },
        quantity: item.quantity,
      }));
      setItems(backendItems);
    } catch (err) {
      // fallback: local update
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const increase = async (id: string) => {
    try {
      // Find cart item to get cartItemId (backend may use a different id)
      const res = await cartApi.getCart();
      const backendItem = (res.data.items || []).find(
        (i: any) => i.menu_item_id === id,
      );
      if (backendItem) {
        await cartApi.updateCartItem(backendItem.id, backendItem.quantity + 1);
        // Refetch cart
        const res2 = await cartApi.getCart();
        const backendItems = (res2.data.items || []).map((item: any) => ({
          id: item.menu_item_id,
          name: item.menu_item_name,
          price: item.price,
          image: { uri: item.image },
          quantity: item.quantity,
        }));
        setItems(backendItems);
      }
    } catch (err) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
      );
    }
  };

  const decrease = async (id: string) => {
    try {
      const res = await cartApi.getCart();
      const backendItem = (res.data.items || []).find(
        (i: any) => i.menu_item_id === id,
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
        const backendItems = (res2.data.items || []).map((item: any) => ({
          id: item.menu_item_id,
          name: item.menu_item_name,
          price: item.price,
          image: { uri: item.image },
          quantity: item.quantity,
        }));
        setItems(backendItems);
      }
    } catch (err) {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      );
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
