import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  loader: {
    marginVertical: 10,
  },
  listsWrapper: {
    flex: 1,
    gap: 24,
  },
  cardSection: {
    borderRadius: 12,
    padding: 16,
    // Sombras para iOS e Web
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Sombra para Android
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D0D5DD",
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
    gap: 12,
  },
  paidItem: {
    opacity: 0.6,
  },
  paidText: {
    textDecorationLine: "line-through",
    color: "#98A2B3",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8, // Bordas levemente arredondadas idênticas às da imagem
    justifyContent: "center",
    alignItems: "center",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
  },
  itemDate: {
    fontSize: 12,
    color: "#667085",
    marginTop: 2,
  },
  itemAmount: {
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  negativeAmount: {
    color: "#F04438",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
