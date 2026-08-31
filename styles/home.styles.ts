import { StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";

export const getHomeStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome,
    },
  content: {
      flex: 1,
      padding: isMobile ? 14 : 24,
      paddingBottom: isMobile ? 90 : 24,
      paddingTop: isMobile ? 64 : 24,
      marginLeft: isMobile ? 0 : 26,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.textColor,
    },
  });
