import { StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";

export const getSettingsStyles = (colors: ThemeColors, isMobile: boolean) =>
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
      paddingTop: isMobile ? 75 : 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.textColor,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray,
      marginBottom: 24,
    },

    // ---------- Seletor de tema ----------
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textColor,
      marginBottom: 12,
      marginTop: 12,
    },
    themeOptions: {
      flexDirection: "row",
      gap: 12,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      backgroundColor: colors.surface,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.skyBlueSuave,
    },
    themeOptionText: {
      color: colors.textColor,
      fontSize: 14,
      fontWeight: "600",
    },
    themeOptionTextActive: {
      color: colors.primary,
    },
  });
