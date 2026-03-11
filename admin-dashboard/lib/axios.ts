// admin-dashboard/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  // Prefer env-configured API URL, fallback to localhost for dev
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
