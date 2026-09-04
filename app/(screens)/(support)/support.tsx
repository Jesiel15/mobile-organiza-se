import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { styles } from "@/styles/(components)/support.styles";
import React from "react";
import { Text, View } from "react-native";

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Suporte" />

      <View style={styles.content}>
        <Text style={styles.title}>Tela de Suporte </Text>
      </View>
    </View>
  );
}
