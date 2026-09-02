import { authEvents } from "@/services/auth-events";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import { api } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isHandlingUnauthorized = useRef(false);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar os dados:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Escuta o evento de 401 emitido pelo interceptor do api.ts,
  // mostra um alerta pro usuário e só desloga depois que ele confirmar.
  useEffect(() => {
    const unsubscribe = authEvents.onUnauthorized((message) => {
      if (isHandlingUnauthorized.current) return;
      isHandlingUnauthorized.current = true;

      const finalMessage =
        message || "Sua sessão expirou. Faça login novamente.";

      if (Platform.OS === "web") {
        window.alert(`Sessão expirada\n\n${finalMessage}`);
        signOut();
      } else {
        Alert.alert("Sessão expirada", finalMessage, [
          {
            text: "OK",
            onPress: async () => {
              await signOut();
            },
          },
        ]);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    const { token: userToken, user: userData } = response.data;

    await AsyncStorage.setItem("token", userToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    isHandlingUnauthorized.current = false; // nova sessão, libera a trava
  };

  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/register", { name, email, password });
    const { token: userToken, user: userData } = response.data;

    await AsyncStorage.setItem("token", userToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    isHandlingUnauthorized.current = false; // nova sessão, libera a trava
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;

    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    await AsyncStorage.setItem("user", JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
