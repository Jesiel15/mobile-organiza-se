import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { getHomeStyles } from "../../../styles/home.styles";

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getHomeStyles(colors, isMobile);

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Início" />

      <View style={styles.content}>
        <Text style={{ color: colors.textColor }}>Olá,</Text>
        <Text style={styles.title}>{user?.name}</Text>
      </View>
    </View>
  );
}
