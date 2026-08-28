import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Desktop Sidebar
  desktopSidebar: {
    width: 250,
    height: "100%",
    backgroundColor: "#333333",
  },
  sidebarInner: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 12,
  },
  menuList: {
    flex: 1,
    gap: 8,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: "#e8f0fe",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  menuTextActive: {
    color: "#2f7cf6",
    fontWeight: "bold",
  },
  footer: {
    marginTop: "auto",
  },

  // Mobile Styles
  mobileBar: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
  },
  drawerContainer: {
    width: "75%",
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#333333",
  },
  modalCloseArea: {
    flex: 1,
  },
});