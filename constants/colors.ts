// Paleta de cores centralizada do app.
// Espelha as CSS variables usadas no frontend Angular (styles.css),
// pra manter os dois projetos com a mesma identidade visual.

export interface ThemeColors {
  // Separando cores
  iconeOutColor: string;
  iconeColor: string;
  checkmarkOut: string;
  checkmark: string;
  modalColor: string;
  outLineInputDate: string;
  buttonLogoutConfig: string;
  calendarBackgroundIcon: string;

  // Brand colours
  red: string;
  redSuave: string;
  purple: string;
  green: string;
  blue: string;
  pink: string;
  lilac: string;
  neonGreen: string;
  skyBlueSuave: string;
  skyBlue: string;
  calendario: string;

  // Base colours
  white: string;
  black: string;
  yellow: string;
  gray: string;
  background: string;
  backgroundHome: string;

  // Aura / componentes
  primary: string;
  primaryHover: string;
  primaryActive: string;
  textColor: string;
  surface: string;
  surfaceBorder: string;

  // Linhas de listas (despesas/receitas)
  lineColor: string;
  scrollColor: string;
}

export const lightColors: ThemeColors = {
  // Separando cores
  iconeOutColor: "#ffffff",
  iconeColor: "#377cc8",
  checkmarkOut: "#848484",
  checkmark: "#ffffff",
  modalColor: "#ffffff",
  outLineInputDate: "#242424",
  buttonLogoutConfig: "#FF7F00",
  calendarBackgroundIcon: "#2881e4",

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
};

export const darkColors: ThemeColors = {
  // Separando cores
  iconeOutColor: "#848484",
  iconeColor: "#ffffff",
  checkmarkOut: "#ffffff",
  checkmark: "#404040",
  modalColor: "#404040",
  outLineInputDate: "#ffffff",
  buttonLogoutConfig: "#FF7F00",
  calendarBackgroundIcon: "#2881e4",

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
  background: "#2e6fb4",
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
};

export const blueColors: ThemeColors = {
  // Separando cores
  iconeOutColor: "#ffffff",
  iconeColor: "#285f9e",
  checkmarkOut: "#2881e4",
  checkmark: "#ffffff",
  modalColor: "#e0f2fe",
  outLineInputDate: "#242424",
  buttonLogoutConfig: "#FF7F00",
  calendarBackgroundIcon: "#FF7F00",

  // Brand colours
  red: "#e0533d",
  redSuave: "#fecaca",
  purple: "#9da7d0",
  green: "#469b88",
  blue: "#285f9e",
  pink: "#e78c9d",
  lilac: "#d9d8f7",
  neonGreen: "#16df7f",
  skyBlueSuave: "#e0f2fe",
  skyBlue: "#2881e4",
  calendario: "#122c3d",

  // Base colours
  white: "#285f9e",
  black: "#ffffff",
  yellow: "#eed868",
  gray: "#122c3d",
  background: "#2e6fb4",
  backgroundHome: "#377cc8",

  // Aura / componentes
  primary: "#377cc8",
  primaryHover: "#2e6fb4",
  primaryActive: "#285f9e",
  textColor: "#122c3d",
  surface: "#e0f2fe",
  surfaceBorder: "#2e6fb4",

  // Linhas de listas (despesas/receitas)
  lineColor: "#747474",
  scrollColor: "#747474",
};

export type ThemeName = "light" | "dark" | "blue";

export const themes: Record<ThemeName, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
  blue: blueColors,
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
