import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:8000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:8000`;
  }

  return "http://192.168.101.2:8000";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // Evita que a requisição fique travada infinitamente se houver bloqueio de rede
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
