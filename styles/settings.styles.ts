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
      padding: isMobile ? 16 : 32,
      paddingTop: isMobile ? 64 : 32,
      paddingBottom: isMobile ? 90 : 32,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textColor,
      marginBottom: 10,
      marginLeft: isMobile ? 0 : 26,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray,
      marginBottom: 24,
      marginLeft: isMobile ? 0 : 26,
    },

    // ---------- Seletor de tema ----------
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textColor,
      marginBottom: 12,
      marginTop: 12,
      marginLeft: isMobile ? 0 : 26,
    },
    themeOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
      marginLeft: isMobile ? 0 : 26,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
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

    // ---------- Form Inputs ----------
    inputGroup: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      marginLeft: isMobile ? 0 : 26,
      maxWidth: 900,
    },
    input: {
      flex: 1,
      height: 48,
      backgroundColor: colors.surface,
      color: colors.textColor,
      borderRadius: 6,
      paddingHorizontal: 16,
      fontSize: 16,
      borderWidth: 0,
      // Desativa o outline azul/preto padrão do navegador na Web
      outlineStyle: "none" as any,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    inputDisabled: {
      opacity: 0.6,
      // Impede que o cursor clique ou foque no campo desabilitado na Web
      pointerEvents: "none" as any,
    },
    editIconButton: {
      padding: 10,
      marginLeft: 6,
    },

    // ---------- Botões de Ação ----------
    buttonRow: {
      flexDirection: isMobile ? "column" : "row",
      gap: 12,
      marginTop: 8,
      marginLeft: isMobile ? 0 : 26,
      maxWidth: 900,
    },
    saveButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 6,
      minWidth: 160,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.neonGreen,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },
    cancelButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 6,
      minWidth: 160,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.red,
    },
    cancelButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },
  });
