// Paleta de cores centralizada do app.
// Espelha as CSS variables usadas no frontend Angular (styles.css),
// pra manter os dois projetos com a mesma identidade visual.

export const lightColors = {
  // Brand colours
  red: "#e0533d",
  redSuave: "#fecaca",
  purple: "#9da7d0",
  green: "#469b88",
  blue: "#377cc8",
  pink: "#e78c9d",
  lilac: "#d9d8f7",
  neonGreen: "#16df7f",
  skyBlueSuave: "#e0f2fe",
  skyBlue: "#2881e4",
  calendario: "#e0f2fe", // = skyBlueSuave no tema light

  // Base colours
  white: "#ffffff",
  black: "#242424",
  yellow: "#eed868",
  gray: "#848484",
  background: "#bdd4ed",
  backgroundHome: "#f5f5f5",

  // Aura / componentes
  primary: "#377cc8",
  primaryHover: "#2e6fb4",
  primaryActive: "#285f9e",
  textColor: "#242424",
  surface: "#ffffff",
  surfaceBorder: "#848484",

  // Linhas de listas (despesas/receitas)
  lineColor: "#cecece",
  scrollColor: "#cecece",
} as const;

export const darkColors = {
  // Brand colours
  red: "#e0533d",
  redSuave: "#fecaca",
  purple: "#9da7d0",
  green: "#469b88",
  blue: "#377cc8",
  pink: "#e78c9d",
  lilac: "#d9d8f7",
  neonGreen: "#16df7f",
  skyBlueSuave: "#e0f2fe",
  skyBlue: "#2881e4",
  calendario: "#122c3d",

  // Base colours
  white: "#404040",
  black: "#ffffff",
  yellow: "#eed868",
  gray: "#ffffff",
  background: "#404040",
  backgroundHome: "#303030",

  // Aura / componentes
  primary: "#377cc8",
  primaryHover: "#2e6fb4",
  primaryActive: "#285f9e",
  textColor: "#ffffff",
  surface: "#404040",
  surfaceBorder: "#ffffff",

  // Linhas de listas (despesas/receitas)
  lineColor: "#747474",
  scrollColor: "#747474",
} as const;

export type ThemeColors = typeof lightColors;
export type ThemeName = "light" | "dark";

export const themes: Record<ThemeName, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

// Paleta fixa das telas de autenticação (login/register).
// Não muda com o tema do app — é a identidade visual da tela de entrada.
export const authColors = {
  formBackground: "#0d0d0d",
  border: "#3a3a3a",
  text: "#ffffff",
  textMuted: "#e5e5e5",
  link: "#4f8ef7",
  primary: "#2f7cf6",
  primaryText: "#ffffff",
  checkboxBorder: "#3a6ea5",
  checkboxChecked: "#3a6ea5",
  illustrationBackground: "#b9d3ea",
  illustrationText: "#1a1a1a",
  badgeBackground: "#3a6ea5",
} as const;
