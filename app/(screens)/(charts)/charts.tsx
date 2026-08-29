import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import { styles } from "@/styles/charts.styles";
import React from "react";
import { Text, View } from "react-native";

export default function ChartsScreen() {
  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Gráficos" />

      <View style={styles.content}>
        <Text style={styles.title}>Gráficos 📊</Text>
        <Text>Aqui entrarão os relatórios e gráficos do sistema.</Text>
      </View>
    </View>
  );
}
