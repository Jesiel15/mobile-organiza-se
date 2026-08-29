import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../../styles/settings.styles";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Configurações" />

      <View style={styles.content}>
        <Text style={styles.title}>Configuração ⚙</Text>
        <Text>Aqui terá configuração de Dark/Light Mode e conta.</Text>
      </View>
    </View>
  );
}
