import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.102:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
import AsyncStorage from "@react-native-async-storage/async-storage";
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
