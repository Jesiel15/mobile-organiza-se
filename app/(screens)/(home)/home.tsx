import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* Componente Sidebar com a aba "Início" ativa */}
      <Sidebar activeScreen="Início" />

      {/* Conteúdo Principal da Tela */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Olá, {user?.name || "Usuário"}! 👋</Text>
        <Text style={styles.subtext}>Seja bem-vindo de volta.</Text>

        <View style={styles.buttonContainer}>
          <Button title="Sair" color="#dc3545" onPress={signOut} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
