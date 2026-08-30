import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getSidebarStyles } from "@/styles/sidebar-menu.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface SidebarProps {
  activeScreen?: string;
}

export default function Sidebar({ activeScreen = "Início" }: SidebarProps) {
  const { width } = useWindowDimensions();
  const { signOut } = useAuth();
  const { colors } = useTheme();
  const styles = getSidebarStyles(colors);
  const router = useRouter();

  const isMobile = width < 768;

  const menuItems = [
    { label: "Início", icon: "home-outline", route: "/(screens)/(home)/home" },
    {
      label: "Gráficos",
      icon: "bar-chart-outline",
      route: "/(screens)/(charts)/charts",
    },
    {
      label: "Calendário",
      icon: "calendar-outline",
      route: "/(screens)/(calendar)/calendar",
    },
    {
      label: "Configurações",
      icon: "settings-outline",
      route: "/(screens)/(settings)/settings",
    },
  ];

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  // ---------- MOBILE: menu inferior fixo ----------
  if (isMobile) {
    return (
      <View style={styles.bottomBar}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.bottomBarItem}
              onPress={() => handleNavigate(item.route)}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={isActive ? colors.primary : colors.black}
              />
              <Text
                style={[
                  styles.bottomBarText,
                  isActive && styles.bottomBarTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.bottomBarItem} onPress={signOut}>
          <Ionicons name="warning-outline" size={22} color={colors.red} />
          <Text style={[styles.bottomBarText, { color: colors.red }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------- DESKTOP/WEB: sidebar lateral fixo ----------
  return (
    <View style={styles.desktopSidebar}>
      <View style={styles.sidebarInner}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/(images)/logo.png")} // Ajuste os '../' de acordo com a pasta atual do arquivo
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Organiza-se</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = activeScreen === item.label;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => handleNavigate(item.route)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? colors.primary : colors.black}
                />
                <Text
                  style={[styles.menuText, isActive && styles.menuTextActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.menuItem} onPress={signOut}>
            <Ionicons name="warning-outline" size={20} color={colors.red} />
            <Text style={[styles.menuText, { color: colors.red }]}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="call-outline" size={20} color={colors.white} />
            <Text style={styles.menuText}>Suporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
