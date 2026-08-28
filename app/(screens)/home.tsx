import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {user?.name || "Usuário"}! 👋</Text>
      <Text style={styles.subtext}>Seja bem-vindo de volta.</Text>

      <View style={styles.buttonContainer}>
        <Button title="Sair" color="#dc3545" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
