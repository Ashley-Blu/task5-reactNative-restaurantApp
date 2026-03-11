import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authApi from "../api/auth";

type User = {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user/token from storage
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await authApi.getMe();
          setUser(res.data.user);
        } catch {
          setUser(null);
        }
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      await AsyncStorage.setItem("token", token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch {}
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
