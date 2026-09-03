import { StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";

export const getCalendarStyles = (colors: ThemeColors, isMobile: boolean) => {
  const isDark =
    colors.backgroundHome?.toLowerCase() !== "#ffffff" &&
    colors.backgroundHome !== "#f8fafc";

  const cardBg = isDark ? "#363638" : "#FFFFFF";
  const textColor = colors.textColor || (isDark ? "#FFFFFF" : "#1A202C");
  const borderColor = isDark ? "#4A5568" : "#E2E8F0";
  const mutedText = isDark ? "#A0AEC0" : "#718096";

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome || "#1E1E1E",
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: isMobile ? 12 : 24,
      paddingBottom: isMobile ? 90 : 24,
      paddingTop: isMobile ? 64 : 24,
      marginLeft: isMobile ? 0 : 26,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: textColor,
    },

    // Container do Filtro (Restaurado)
    filterContainer: {
      marginBottom: 20,
      width: 160,
      zIndex: 10,
    },
    filterLabel: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      color: textColor,
    },
    customPickerTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: isDark ? "#4A5568" : "#3182CE",
      borderRadius: 6,
      paddingLeft: 12,
      paddingRight: 4,
      height: 38,
    },
    customPickerText: {
      fontSize: 14,
      color: textColor,
      fontWeight: "500",
    },
    iconContainer: {
      backgroundColor: "#3182CE",
      borderRadius: 4,
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },

    // Card Popover de Seleção de Mês/Ano
    popoverCard: {
      position: "absolute",
      top: 68,
      left: 0,
      width: 250,
      backgroundColor: cardBg,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: borderColor,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
      zIndex: 99,
    },
    popoverHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    popoverYearText: {
      color: textColor,
      fontWeight: "bold",
      fontSize: 16,
    },
    arrowButton: {
      padding: 6,
    },
    monthsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      justifyContent: "space-between",
    },
    monthGridItem: {
      width: "30%",
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 6,
      backgroundColor: isDark ? "#1A202C" : "#EDF2F7",
    },
    monthGridItemSelected: {
      backgroundColor: "#3182CE",
    },
    monthGridText: {
      color: mutedText,
      fontSize: 12,
      fontWeight: "600",
    },
    monthGridTextSelected: {
      color: "#FFFFFF",
    },
    popoverFooter: {
      marginTop: 12,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: borderColor,
      alignItems: "center",
    },
    footerActionText: {
      color: "#3182CE",
      fontSize: 13,
      fontWeight: "600",
    },

    // Controles do Calendário
    calendarHeaderControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
      backgroundColor: cardBg,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderColor,
    },
    headerLeftControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    navBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: isDark ? "#2D3748" : "#EDF2F7",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: borderColor,
    },
    navBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: textColor,
    },
    currentMonthTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: textColor,
      textTransform: "capitalize",
    },

    // Card Principal e Grade (Grid)
    gridContainer: {
      backgroundColor: cardBg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderColor,
      overflow: "hidden",
    },
    weekDaysHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      backgroundColor: isDark ? "#2D3748" : "#F7FAFC",
    },
    weekDayCell: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: borderColor,
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: "bold",
      color: textColor,
    },

    // Células do Dia
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: `${100 / 7}%`,
      minHeight: isMobile ? 85 : 115,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: borderColor,
      padding: 4,
      backgroundColor: cardBg,
    },
    otherMonthCell: {
      backgroundColor: isDark ? "#28282A" : "#FAFAFA",
    },
    todayCell: {
      backgroundColor: isDark ? "#2C3B4E" : "#FEFCBF",
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: "600",
      color: textColor,
      alignSelf: "flex-end",
      marginBottom: 4,
      marginRight: 2,
    },
    otherMonthDayNumber: {
      color: mutedText,
      opacity: 0.5,
    },

    // Cartões de Eventos / Lançamentos nos Dias
    eventsContainer: {
      gap: 3,
    },
    eventCard: {
      backgroundColor: isDark ? "rgba(49, 130, 206, 0.2)" : "#EBF8FF",
      borderRadius: 3,
      paddingVertical: 2,
      paddingHorizontal: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    eventText: {
      fontSize: 11,
      color: textColor,
      fontWeight: "500",
      flex: 1,
    },

    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginVertical: 20,
    },
    loadingText: {
      color: textColor,
      fontSize: 14,
    },
  });
};
