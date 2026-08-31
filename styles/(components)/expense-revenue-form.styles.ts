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
      marginBottom: 6,
      marginLeft: isMobile ? 0 : 26,
    },
    labelIconeColor: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textColor,
      marginBottom: 6,
      marginLeft: 0,
    },
    inputGroup: {
      marginBottom: 16,
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
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 6,
      fontSize: 16,
      marginLeft: isMobile ? 0 : 26,
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
    },
    dateInput: {
      width: isMobile ? "100%" : 180,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },

    /* Seletor com Input Híbrido */
    filterContainer: {
      position: "relative",
      zIndex: 1000,
      marginBottom: 16,
    },
    dateInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginLeft: isMobile ? 0 : 26,
      width: isMobile ? "100%" : 260,
      height: 48,
      borderWidth: 0,
      borderColor: "transparent",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    dateInputWrapperFocused: {
      borderColor: isMobile ? "" : colors.outLineInputDate,
      borderWidth: isMobile ? 0 : 2.5,
    },
    dateTextInput: {
      flex: 1,
      height: "100%",
      paddingLeft: 16,
      paddingRight: 8,
      fontSize: 16,
      color: colors.textColor,
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    calendarIconButton: {
      backgroundColor: colors.primary,
      width: 52,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    popoverCard: {
      position: "absolute",
      top: 75,
      left: isMobile ? 0 : 26,
      width: isMobile ? "100%" : 280,
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
    headerTitleGroup: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },
    popoverHeaderTitle: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.textColor,
      textTransform: "capitalize",
    },
    activeTitleText: {
      color: colors.primary,
      textDecorationLine: "underline",
    },
    arrowButton: {
      padding: 4,
    },

    /* Grids do Popover */
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      justifyContent: "flex-start",
    },
    dayGridItem: {
      width: "12.5%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      backgroundColor: colors.backgroundHome,
    },
    dayGridItemSelected: {
      backgroundColor: colors.primary,
    },
    dayGridText: {
      fontSize: 13,
      color: colors.textColor,
    },
    dayGridTextSelected: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    pickerGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    pickerGridItem: {
      width: "30%",
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: colors.backgroundHome,
    },
    pickerGridItemSelected: {
      backgroundColor: colors.primary,
    },
    pickerGridText: {
      fontSize: 14,
      color: colors.textColor,
      fontWeight: "500",
    },
    pickerGridTextSelected: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    popoverFooter: {
      marginTop: 12,
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.lineColor,
      paddingTop: 8,
    },
    footerActionText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },

    /* Ações */
    actionsContainer: {
      flexDirection: isMobile ? "column" : "row",
      gap: 12,
      marginTop: 16,
      marginLeft: isMobile ? 0 : 26,
    },
    saveButton: {
      backgroundColor: colors.neonGreen,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 6,
      minWidth: 160,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },
    cancelButton: {
      backgroundColor: colors.red,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 6,
      minWidth: 160,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },

    /* Modais */
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
      marginBottom: 16,
    },
    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
      paddingVertical: 12,
    },
    iconGridItem: {
      width: 48,
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.lineColor,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.iconeColor,
    },
    iconGridItemSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    closeModalButton: {
      backgroundColor: colors.red,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginTop: 16,
      alignSelf: isMobile ? "stretch" : "flex-end",
      minWidth: 120,
    },
    closeModalButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 14,
    },
  });
