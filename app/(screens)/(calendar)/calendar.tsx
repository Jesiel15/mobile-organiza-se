import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../../styles/calendar.styles";

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Calendário" />

      <View style={styles.content}>
        <Text style={styles.title}>Calendário 📅</Text>
        <Text>Aqui mostrára as datas no calendário.</Text>
      </View>
    </View>
  );
}
