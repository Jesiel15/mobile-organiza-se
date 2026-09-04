import { ThemeColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const getCalendarStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors?.backgroundHome || "#1E1E1E",
      width: "100%",
      minHeight: "100%",
    },
    mainContent: {
      flex: 1,
      width: "100%",
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    content: {
      flexGrow: 1,
      // padding: isMobile ? 12 : 24,
      paddingRight: isMobile ? 12 : 44,
      paddingLeft: isMobile ? 12 : 44,
      paddingBottom: isMobile ? 120 : 44,
      paddingTop: isMobile ? 64 : 44,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors?.textColor || "#FFFFFF",
      marginBottom: 24,
    },

    // --- FILTRO DE MÊS/ANO ---
    filterContainer: {
      marginBottom: 20,
      position: "relative",

      zIndex: 9999,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors?.textColor || "#FFFFFF",

      marginBottom: 8,
    },
    customPickerTrigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors?.surface || "#363638",
      borderRadius: 8,
      paddingLeft: 14,
      paddingRight: 0,
      height: 44,
      width: isMobile ? "100%" : 300,
      overflow: "hidden",
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
    },
    customPickerText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors?.textColor || "#FFFFFF",
    },
    iconContainer: {
      backgroundColor: colors?.calendarBackgroundIcon || "#3182CE",
      height: "100%",
      width: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    // --- POPOVER DO SELETOR DE MÊS/ANO ---
    popoverCard: {
      position: "absolute",
      top: 76,
      left: 0,
      width: isMobile ? "100%" : 320,
      backgroundColor: colors?.surface || "#2D3748",
      borderRadius: 12,
      padding: 16,
      zIndex: 10000,
      elevation: 10,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
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
      fontSize: 20,
      fontWeight: "600",
      color: colors?.textColor || "#FFFFFF",
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
      backgroundColor: colors?.backgroundHome || "#1A202C",
    },
    monthGridItemSelected: {
      backgroundColor: colors?.primary || "#3182CE",
    },
    monthGridText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors?.gray || "#A0AEC0",
      textTransform: "lowercase",
    },
    monthGridTextSelected: {
      color: "#FFFFFF",
      fontWeight: "700",
    },
    popoverFooter: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors?.surfaceBorder || "#4A5568",
      alignItems: "flex-end",
    },
    footerActionText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors?.primary || "#3182CE",
    },

    // --- ESTRUTURA DO CALENDÁRIO ---
    calendarCard: {
      backgroundColor: colors?.surface || "#363638",
      borderRadius: 12,
      padding: isMobile ? 12 : 20,
      overflow: "hidden",
      zIndex: 1,
      boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.1)",
    },
    calendarHeaderControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 16,
    },
    headerLeftControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    navBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors?.blue || "#2D3748",
      borderRadius: 6,
    },
    navBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors?.textColor || "#FFFFFF",
    },
    currentMonthTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors?.textColor || "#FFFFFF",
      textTransform: "capitalize",
    },

    // --- GRADE DE DIAS E EVENTOS ---
    weekDaysHeader: {
      flexDirection: "row",
      backgroundColor: colors?.backgroundHome || "#2D3748",
      borderWidth: 1,
      borderColor: colors?.surfaceBorder || "#4A5568",
    },
    weekDayCell: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: colors?.surfaceBorder || "#4A5568",
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors?.textColor || "#FFFFFF",
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: `${100 / 7}%`,
      minHeight: isMobile ? 80 : 110,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors?.surfaceBorder || "#4A5568",
      padding: 4,
      backgroundColor: colors?.surface || "#363638",
    },
    otherMonthCell: {
      opacity: 0.4,
    },
    todayCell: {
      backgroundColor: "rgba(49, 130, 206, 0.15)",
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: "600",
      color: colors?.textColor || "#FFFFFF",
      alignSelf: "flex-end",
      marginBottom: 4,
      marginRight: 2,
    },
    otherMonthDayNumber: {
      color: colors?.gray || "#A0AEC0",
    },
    eventsContainer: {
      gap: 3,
    },
    eventCard: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 4,
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
      color: colors?.textColor || "#FFFFFF",
      fontWeight: "500",
      flex: 1,
    },
    loader: {
      marginVertical: 20,
    },
  });

export default getCalendarStyles;
