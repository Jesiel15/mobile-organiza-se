import { ThemeColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const getSummaryCardsStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: isMobile ? "column" : "row",
      gap: 16,
      marginBottom: 24,
      width: isMobile ? "100%" : "50%",
    },
    card: {
      flex: 1,
      backgroundColor: colors?.surface || "#FFFFFF",
      borderRadius: 12,
      padding: isMobile ? 16 : 24,
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
    cardTitle: {
      fontSize: isMobile ? 14 : 16,
      fontWeight: "500",
      color: colors?.gray || "#667085",
      marginBottom: 8,
    },
    cardValue: {
      fontSize: isMobile ? 20 : 28,
      fontWeight: "700",
      color: colors?.textColor || "#101828",
    },
    expenseText: {
      color: colors?.red || "#D92D20",
    },
    revenueText: {
      color: colors?.blue || "#079455",
    },
    positiveBalanceText: {
      color: colors?.neonGreen || "#101828",
    },
  });

export default getSummaryCardsStyles;
