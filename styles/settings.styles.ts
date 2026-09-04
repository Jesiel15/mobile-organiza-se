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
      // padding: isMobile ? 16 : 32,

      paddingLeft: isMobile ? 12 : 44,
      paddingRight: isMobile ? 12 : 44,
      paddingBottom: isMobile ? 90 : 44,
      paddingTop: isMobile ? 64 : 44,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textColor,
      marginBottom: 10,
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
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
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
    themeOptionActiveBlue: {
      borderColor: colors.white,
      backgroundColor: colors.gray,
    },
    themeOptionTextBlue: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
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
      maxWidth: 900,
    },
    logoutButton: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      marginBottom: 36,
      borderRadius: 6,
      minWidth: 160,
      maxWidth: 200,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.buttonLogoutConfig,
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
