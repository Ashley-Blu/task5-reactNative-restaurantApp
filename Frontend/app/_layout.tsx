// app/_layout.tsx
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { CartProvider } from "../context/CartContext";

export default function Layout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="location" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>

      <Toast />
    </CartProvider>
  );
}
