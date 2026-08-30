import { Platform, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/colors";

export const getSidebarStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ---------- DESKTOP SIDEBAR ----------
    desktopSidebar: {
      width: 220,
      backgroundColor: colors.white,
      height: "100%",
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
    sidebarInner: {
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    logoImage: {
      width: 52,
      height: 52,
      marginTop: 14,
    },
    logoText: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "700",
      includeFontPadding: false,
    },
    divider: {
      height: 1,
      backgroundColor: colors.lineColor,
      marginHorizontal: 12,
    },
    menuList: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 8,
      gap: 4,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    menuItemActive: {
      backgroundColor: colors.skyBlueSuave,
    },
    menuText: {
      color: colors.black,
      fontSize: 14,
      fontWeight: "500",
    },
    menuTextActive: {
      color: colors.primary,
      fontWeight: "700",
    },
    footer: {
      paddingBottom: 12,
    },

    // ---------- MOBILE BOTTOM BAR ----------
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      backgroundColor: colors.white,
      paddingTop: 8,
      paddingBottom: Platform.OS === "ios" ? 22 : 10,
      borderTopWidth: 1,
      borderTopColor: colors.lineColor,
    },
    bottomBarItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    bottomBarText: {
      fontSize: 11,
      color: colors.black,
      fontWeight: "500",
    },
    bottomBarTextActive: {
      color: colors.primary,
      fontWeight: "700",
    },
  });
