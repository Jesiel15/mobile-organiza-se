import { Platform, StyleSheet } from "react-native";
import { ThemeColors } from "./colors";

export const getSidebarStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ---------- DESKTOP SIDEBAR ----------
    desktopSidebar: {
      width: 220,
      backgroundColor: colors.black,
      height: "100%",
    },
    sidebarInner: {
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 18,
    },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    logoText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
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
      color: colors.white,
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
      backgroundColor: colors.black,
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
      color: colors.gray,
      fontWeight: "500",
    },
    bottomBarTextActive: {
      color: colors.primary,
      fontWeight: "700",
    },
  });
