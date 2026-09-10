import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { authEvents } from "./auth-events";

const getBaseUrl = () => {
  // if (Platform.OS === "web") {
  //   return "http://localhost:8000";
  // }

  // const hostUri = Constants.expoConfig?.hostUri;
  // if (hostUri) {
  //   const ip = hostUri.split(":")[0];
  //   return `http://${ip}:8000`;
  // }

  // return "http://192.168.101.2:8000";
  return "https://api-organizase.vecode.com.br/";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // Evita que a requisição fique travada infinitamente se houver bloqueio de rede
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function withTimeout<T>(promise: Promise<T>, ms = 3000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("AsyncStorage timeout")), ms)
    ),
  ]);
}

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await withTimeout(AsyncStorage.getItem("token"));
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Falha ao ler token, seguindo sem auth:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Novo: interceptor de response, detecta token expirado/inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignora o auto-logout se o erro 401 for retornado na rota de alteração de senha
    const isPasswordEndpoint = error.config?.url?.includes("/user/password");

    if (error.response?.status === 401 && !isPasswordEndpoint) {
      const msg = error.response?.data?.msg;
      authEvents.emitUnauthorized(msg);
    }

    return Promise.reject(error);
  }
);
