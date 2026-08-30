import { ThemeColors, ThemeName, themes } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

const THEME_STORAGE_KEY = "@organiza:theme";

interface ThemeContextData {
  theme: ThemeName;
  colors: ThemeColors;
  isThemeLoading: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null

  // Começa seguindo o tema do sistema até carregarmos a preferência salva.
  const [theme, setThemeState] = useState<ThemeName>(
    systemScheme === "dark" ? "dark" : "light"
  );
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Carrega o tema salvo assim que o app abre.
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.warn("Não foi possível carregar o tema salvo:", error);
      } finally {
        setIsThemeLoading(false);
      }
    })();
  }, []);

  // Troca o tema em memória e já persiste no dispositivo.
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme).catch((error) => {
      console.warn("Não foi possível salvar o tema:", error);
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const colors = useMemo(() => themes[theme], [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, colors, isThemeLoading, setTheme, toggleTheme }}
    >
      <StatusBar
        style={theme === "light" ? "dark" : "light"}
        backgroundColor={colors.backgroundHome}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
