import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // No Web/Desktop coloca a Sidebar à esquerda e o conteúdo à direita
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 200,
  },
});
