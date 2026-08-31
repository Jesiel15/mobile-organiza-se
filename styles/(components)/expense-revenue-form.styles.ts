import { StyleSheet } from "react-native";
import { ThemeColors } from "../../constants/colors";

export const getExpenseRevenueFormStyles = (
  colors: ThemeColors,
  isMobile: boolean
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome,
    },
    contentContainer: {
      flex: 1,
      padding: isMobile ? 16 : 32,
      paddingTop: isMobile ? 64 : 32,
      paddingBottom: isMobile ? 90 : 32,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      color: colors.textColor,
      fontSize: 16,
    },
    formContainer: {
      maxWidth: 900,
      width: "100%",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textColor,
      marginBottom: 24,
      marginLeft: isMobile ? 0 : 26,
    },
    selectorsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: isMobile ? 20 : 40,
      marginBottom: 20,
      marginLeft: isMobile ? 0 : 26,
      flexWrap: "wrap",
    },
    selectorItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textColor,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    colorBox: {
      width: 40,
      height: 40,
      borderRadius: 8,
    },
    colorPickerContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      marginLeft: isMobile ? 0 : 26,
      maxWidth: 320,
      // borderWidth: 1,
      // borderColor: colors.surfaceBorder,
      boxShadow: [
        {
          offsetX: 2,
          offsetY: 4,
          blurRadius: 4,
          spreadDistance: 0,
          color: "rgba(0, 0, 0, 0.1)",
        },
      ],
    },
    colorPickerTitle: {
      color: colors.textColor,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 12,
    },
    paletteGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    paletteCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    paletteCircleSelected: {
      borderWidth: 3,
      borderColor: colors.black,
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.textColor,
      // borderWidth: 1,
      // borderColor: colors.surfaceBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 6,
      fontSize: 16,
      marginBottom: 16,
      marginLeft: isMobile ? 0 : 26,
      boxShadow: [
        {
          offsetX: 2,
          offsetY: 4,
          blurRadius: 4,
          spreadDistance: 0,
          color: "rgba(0, 0, 0, 0.1)",
        },
      ],
    },
    dateInput: {
      width: isMobile ? "100%" : 180,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    buttonRow: {
      flexDirection: isMobile ? "column" : "row",
      gap: 12,
      marginTop: 8,
      marginLeft: isMobile ? 0 : 26,
    },
    btn: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 6,
      minWidth: 160,
      alignItems: "center",
      justifyContent: "center",
    },
    btnSave: {
      backgroundColor: colors.neonGreen,
    },
    btnCancel: {
      backgroundColor: colors.red,
    },
    btnText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      width: "100%",
      maxWidth: 640,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textColor,
    },
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
      paddingVertical: 12,
    },
    iconTile: {
      width: 48,
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.lineColor,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundHome,
    },
    iconTileSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    modalCancelBtn: {
      backgroundColor: colors.red,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginTop: 16,
      alignSelf: isMobile ? "stretch" : "flex-end",
      minWidth: 120,
    },
  });
