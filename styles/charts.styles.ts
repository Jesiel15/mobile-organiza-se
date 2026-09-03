import { StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";

const MUTED_TEXT_FALLBACK = "rgba(226,232,240,0.65)";

export const getChartsStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: isMobile ? 16 : 32,
      paddingBottom: isMobile ? 90 : 32,
      paddingTop: isMobile ? 64 : 32,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      color: colors.textColor,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textColor,
      marginBottom: 6,
    },

    /* Componente Input de Ano Ajustado */
    filterContainer: {
      position: "relative",
      zIndex: 1000,
      marginBottom: 20,
    },
    dateInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 8,
      width: isMobile ? "100%" : 200,
      height: 42,
      borderWidth: 0,
      borderColor: "transparent",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    dateInputWrapperFocused: {
      borderColor: isMobile ? "transparent" : colors.outLineInputDate,
      borderWidth: isMobile ? 0 : 2,
    },
    dateTextInput: {
      flex: 1,
      minWidth: 0,
      height: "100%",
      paddingLeft: 14,
      paddingRight: 8,
      fontSize: 15,
      color: colors.textColor,
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    calendarIconButton: {
      backgroundColor: colors.primary,
      width: 42,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      flexShrink: 0,
    },
    popoverCard: {
      position: "absolute",
      top: 74,
      left: 0,
      width: isMobile ? "100%" : 220,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      elevation: 5,
      zIndex: 1001,
    },
    popoverHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    popoverHeaderTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.textColor,
    },
    arrowButton: {
      padding: 4,
    },

    /* Grid do Popover */
    pickerGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    pickerGridItem: {
      width: "30%",
      height: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: colors.backgroundHome,
    },
    pickerGridItemSelected: {
      backgroundColor: colors.primary,
    },
    pickerGridText: {
      fontSize: 13,
      color: colors.textColor,
      fontWeight: "500",
    },
    pickerGridTextSelected: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    /* Legendas */
    legendContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 14,
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
    },
    legendBadge: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    legendText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textColor,
    },

    /* Layout dos Gráficos */
    chartsGrid: {
      flexDirection: isMobile ? "column" : "row",
      gap: 20,
      alignItems: "stretch",
    },
    chartCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      overflow: "hidden",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
    },
    chartCardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textColor,
      marginBottom: 16,
    },
    chartStyle: {
      borderRadius: 8,
      paddingRight: 12,
    },
    chartCardEmpty: {
      alignItems: "center",
      justifyContent: "center",
      height: 280,
    },
    chartCardEmptyText: {
      fontSize: 13,
      color: MUTED_TEXT_FALLBACK,
    },

    /* Tooltip do Gráfico de Barras (hover no web / tap no touch) */
    tooltipContainer: {
      position: "absolute",
      minWidth: 160,
      maxWidth: 220,
      backgroundColor: "#1c2129",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.35)",
      elevation: 6,
      zIndex: 10,
    },
    tooltipMonth: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: 6,
    },
    tooltipRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    tooltipSwatch: {
      width: 10,
      height: 10,
      borderRadius: 2,
      flexShrink: 0,
    },
    tooltipText: {
      fontSize: 12,
      color: "#FFFFFF",
      flexShrink: 1,
    },
  });
