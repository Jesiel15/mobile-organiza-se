import { ThemeColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const getConfirmModalStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContainer: {
      width: "90%",
      maxWidth: 440,
      backgroundColor: colors.modalColor,
      borderRadius: 12,
      padding: 24,
      boxShadow: [
        {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 16,
          spreadDistance: 0,
          color: "rgba(0, 0, 0, 0.25)",
        },
      ],
      elevation: 5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
    },
    closeButton: {
      padding: 4,
    },
    message: {
      fontSize: 16,
      color: colors.textColor || colors.black,
      textAlign: "left",
      marginVertical: 8,
      lineHeight: 22,
      fontWeight: "400",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 24,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 100,
    },
    cancelButton: {
      backgroundColor: colors.red,
    },
    confirmButton: {
      backgroundColor: colors.neonGreen,
    },
    cancelButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
    confirmButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
  });
