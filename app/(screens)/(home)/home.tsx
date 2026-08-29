import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Button, Text, View } from "react-native";
import { styles } from "../(home)/home.styles";
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
