import { ThemeColors, ThemeName, themes } from "@/styles/colors";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

interface ThemeContextData {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null

  // Começa seguindo o tema do sistema. Se o usuário trocar manualmente
  // (ex: nas Configurações), esse valor passa a mandar.
  const [theme, setTheme] = useState<ThemeName>(
    systemScheme === "dark" ? "dark" : "light"
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = useMemo(() => themes[theme], [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
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
