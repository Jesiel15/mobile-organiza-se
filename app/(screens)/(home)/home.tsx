import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { styles } from "../../../styles/home.styles";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Início" />

      <View style={styles.content}>
        <Text>Olá,</Text>
        <Text style={styles.title}>{user?.name}</Text>
      </View>
    </View>
  );
}
