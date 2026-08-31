import { ThemeColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const getTransactionsStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.backgroundHome || "#F9FAFB",
    },
    scrollContent: {
      padding: 0,
      paddingTop: 20,
      paddingBottom: isMobile ? 120 : 32,
    },
    loader: {
      marginVertical: 10,
    },
    filterContainer: {
      marginBottom: 20,
      position: "relative",
      zIndex: 999,
    },
    filterLabel: {
      fontSize: 20,
      fontWeight: "600",
      color: colors?.textColor || "#101828",
      marginBottom: 8,
    },
    customPickerTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors?.surface || "#FFFFFF",
      borderColor: colors?.surfaceBorder || "#D0D5DD",
      borderRadius: 8,
      paddingLeft: 14, // Mudado de paddingHorizontal para aplicar padding só na esquerda
      paddingRight: 0, // Garante que o ícone encoste na borda direita
      height: 48,
      width: isMobile ? "100%" : 360,
      overflow: "hidden", // Obriga o fundo azul do ícone a respeitar o borderRadius
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
    iconContainer: {
      backgroundColor: isMobile ? colors?.white : colors?.background,
      height: "100%", // Preenche toda a altura (48px) do container
      width: 48, // Cria um quadrado perfeito do lado direito
      alignItems: "center",
      justifyContent: "center",
    },
    customPickerText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors?.textColor || "#344054",
      textTransform: "capitalize",
    },

    popoverCard: {
      position: "absolute",
      top: 80,
      left: 0,
      width: isMobile ? "100%" : 360,
      backgroundColor: colors?.surface || "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors?.surfaceBorder || "#E4E7EC",
      padding: 16,
      zIndex: 1000,
      elevation: 5,
    },
    popoverHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    arrowButton: {
      padding: 4,
    },
    popoverYearText: {
      fontSize: 24,
      fontWeight: "600",
      color: colors?.textColor || "#101828",
    },
    monthsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "space-between",
    },
    monthGridItem: {
      width: "22%",
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors?.backgroundHome || "#F9FAFB",
    },
    monthGridItemSelected: {
      backgroundColor: colors?.skyBlueSuave || "#E0F2FE",
      // borderWidth: 1,
      borderColor: colors?.primary || "#0284C7",
    },
    monthGridText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors?.textColor || "#344054",
      textTransform: "lowercase",
    },
    monthGridTextSelected: {
      color: colors?.primary || "#0284C7",
      fontWeight: "700",
    },
    popoverFooter: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors?.surfaceBorder || "#F2F4F7",
      alignItems: "flex-end",
    },
    footerActionText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors?.primary || "#0284C7",
    },
    listsWrapper: {
      flexDirection: isMobile ? "column" : "row",
      gap: 20,
    },
    columnContainer: {
      flex: 1,
      width: "100%",
    },
    sectionTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: colors?.textColor || "#101828",
      marginBottom: 12,
    },
    cardSection: {
      borderRadius: 12,
      padding: isMobile ? 14 : 48,
      // borderWidth: 1,
      borderColor: colors?.surfaceBorder || "#EAECF0",
      backgroundColor: colors?.surface || "#FFFFFF",
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
    addButton: {
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors?.surfaceBorder || "#D0D5DD",
      borderRadius: 8,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    addButtonText: {
      color: colors?.gray || "#475467",
      fontWeight: "500",
      fontSize: 20,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0, 0, 0, 0.2)",
      gap: 18,
    },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    dateAndAmountRow: {
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginTop: 2,
    },
    itemDetails: {
      flex: 1,
      marginRight: 8,
    },
    itemName: {
      fontSize: isMobile ? 14 : 16,
      fontWeight: "500",
      color: colors?.textColor || "#101828",
    },
    itemDate: {
      fontSize: 14,
      color: colors?.gray || "#667085",
      // marginTop: 2,
    },
    itemAmount: {
      fontSize: isMobile ? 14 : 16,
      fontWeight: "600",
      color: colors?.textColor || "#101828",
      marginTop: isMobile ? 2 : 0,
    },
    paidText: {
      textDecorationLine: "line-through",
      color: colors?.gray || "#98A2B3",
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });

export default getTransactionsStyles;
