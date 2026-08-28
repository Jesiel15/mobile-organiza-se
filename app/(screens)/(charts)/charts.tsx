import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./charts.styles";

export default function ChartsScreen() {
  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Gráficos" />

      <View style={styles.content}>
        <Text style={styles.title}>Tela de Gráficos 📊</Text>
        <Text>Aqui entrarão os relatórios e gráficos do sistema.</Text>
      </View>
    </View>
  );
}
