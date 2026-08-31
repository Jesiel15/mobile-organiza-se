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
  const systemScheme = useColorScheme();

  const [theme, setThemeState] = useState<ThemeName>(
    systemScheme === "dark" ? "dark" : "light"
  );
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        )) as ThemeName | null;

        // Valida se o tema salvo é uma chave válida do seu objeto themes (incluindo 'blue')
        if (savedTheme && savedTheme in themes) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.warn("Não foi possível carregar o tema salvo:", error);
      } finally {
        setIsThemeLoading(false);
      }
    })();
  }, []);

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
