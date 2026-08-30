import { ThemeColors } from "./colors";

type ExtendedThemeColors = ThemeColors & {
  [key: string]: string | undefined;
};

export const getPaletteColors = (colors?: ThemeColors): string[] => {
  const c = (colors || {}) as ExtendedThemeColors;

  return [
    // 1. Vermelho
    "#FF6666",
    "#FF0000",
    "#800000",

    // 2. Verde
    "#66FF66",
    "#00FF00",
    "#008000",

    // 3. Azul
    "#6666FF",
    "#0000FF",
    "#000080",

    // 4. Ciano
    "#66FFFF",
    "#00FFFF",
    "#008080",

    // 5. Magenta
    "#FF66FF",
    "#FF00FF",
    "#800080",

    // 6. Amarelo
    "#FFFF66",
    "#FFFF00",
    "#808000",

    // 7. Laranja
    "#FFB266",
    "#FF7F00",
    "#804000",

    // 8. Lima
    "#B2FF66",
    "#7FFF00",
    "#408000",

    // 9. Menta / Ciano-Esmeralda
    "#66FFB2",
    "#00FF7F",
    "#008040",

    // 10. Azul-Céu / Azure
    "#66B2FF",
    "#007FFF",
    "#004080",

    // 11. Violeta / Roxo
    "#B266FF",
    "#7F00FF",
    "#400080",

    // 12. Rosa / Rose
    "#FF66B2",
    "#FF007F",
    "#800040",

    // 13. Cinza Claro
    // "#E0E0E0",
    // "#C0C0C0",
    // "#A0A0A0",

    // 14. Cinza Médio
    "#A0A0A0",
    "#808080",
    "#606060",

    // 15. Cinza Escuro
    // "#606060",
    // "#404040",
    "#202020",
  ];
};
