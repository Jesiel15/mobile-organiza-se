import Sidebar from "@/components/sidebar-menu/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { getSettingsStyles } from "../../../styles/settings.styles";

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getSettingsStyles(colors, isMobile);

  const themeOptions = [
    { label: "Claro", value: "light" as const, icon: "sunny-outline" },
    { label: "Escuro", value: "dark" as const, icon: "moon-outline" },
  ];

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Configurações" />

      <View style={styles.content}>
        <Text style={styles.title}>Configuração ⚙</Text>
        <Text style={styles.subtitle}>
          Aqui você controla a aparência do app e sua conta.
        </Text>

        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={styles.themeOptions}>
          {themeOptions.map((option) => {
            const isActive = theme === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  isActive && styles.themeOptionActive,
                ]}
                onPress={() => setTheme(option.value)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={18}
                  color={isActive ? colors.primary : colors.textColor}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    isActive && styles.themeOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
