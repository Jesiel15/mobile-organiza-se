import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👈 Importe o useRouter
import React, { useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styles } from "./sidebar-menu.styles";

interface SidebarProps {
  activeScreen?: string;
}

export default function Sidebar({ activeScreen = "Início" }: SidebarProps) {
  const { width } = useWindowDimensions();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // 👈 Instancie o router

  const isMobile = width < 768 || Platform.OS !== "web";

  // Mapeie cada item com a sua rota correspondente na pasta (screens)
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
    if (isMobile) setIsOpen(false);
    router.push(route as any); // 👈 Faz a navegação para a tela clicada
  };

  const MenuContent = () => (
    <View style={styles.sidebarInner}>
      {/* Topo - Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="folder-open" size={28} color="#fff" />
          <Text style={styles.logoText}>Organiza-se</Text>
        </View>
        {isMobile && (
          <TouchableOpacity onPress={() => setIsOpen(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Lista de Navegação */}
      <View style={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigate(item.route)} // 👈 Chama a navegação
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={isActive ? "#2f7cf6" : "#fff"}
              />
              <Text
                style={[styles.menuText, isActive && styles.menuTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Botão Sair */}
        <TouchableOpacity style={styles.menuItem} onPress={signOut}>
          <Ionicons name="warning-outline" size={20} color="#ff4d4f" />
          <Text style={[styles.menuText, { color: "#ff4d4f" }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé - Suporte */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="call-outline" size={20} color="#fff" />
          <Text style={styles.menuText}>Suporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isMobile) {
    return (
      <SafeAreaView style={styles.mobileBar}>
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => setIsOpen(true)}>
            <Ionicons name="menu" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.mobileTitle}>Organiza-se</Text>
        </View>

        <Modal
          visible={isOpen}
          animationType="fade"
          transparent
          onRequestClose={() => setIsOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.drawerContainer}>
              <MenuContent />
            </View>
            <TouchableOpacity
              style={styles.modalCloseArea}
              onPress={() => setIsOpen(false)}
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.desktopSidebar}>
      <MenuContent />
    </View>
  );
}
