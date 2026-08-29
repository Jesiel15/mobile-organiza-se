import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { getCalendarStyles } from "@/styles/calendar.styles";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getCalendarStyles(colors, isMobile);

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Calendário" />

      <View style={styles.content}>
        <Text style={styles.title}>Calendário 📅</Text>
        <Text style={{ color: colors.textColor }}>
          Aqui mostrára as datas no calendário.
        </Text>
      </View>
    </View>
  );
}
