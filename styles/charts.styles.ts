import { StyleSheet } from "react-native";
import { ThemeColors } from "./colors";

export const getChartsStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome,
    },
    content: {
      flex: 1,
      padding: 24,
      paddingBottom: isMobile ? 90 : 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.textColor,
    },
  });
