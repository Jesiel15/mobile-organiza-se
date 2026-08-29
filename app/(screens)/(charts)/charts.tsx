import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { getChartsStyles } from "@/styles/charts.styles";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

export default function ChartsScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getChartsStyles(colors, isMobile);

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Gráficos" />

      <View style={styles.content}>
        <Text style={styles.title}>Gráficos 📊</Text>
        <Text style={{ color: colors.textColor }}>
          Aqui entrarão os relatórios e gráficos do sistema.
        </Text>
      </View>
    </View>
  );
}
