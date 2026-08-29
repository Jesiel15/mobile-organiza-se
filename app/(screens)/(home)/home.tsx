import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import TransactionsList from "@/components/(transactions)/transaction-list";
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

        {/* Componente de Transações */}
        <TransactionsList
          onNavigateToAddExpense={() => console.log("Navegar para Add Despesa")}
          onNavigateToAddRevenue={() => console.log("Navegar para Add Receita")}
          onNavigateToEditExpense={(monthYear, id) =>
            console.log(`Editar despesa: ${monthYear}/${id}`)
          }
          onNavigateToEditRevenue={(monthYear, id) =>
            console.log(`Editar receita: ${monthYear}/${id}`)
          }
        />
      </View>
    </View>
  );
}
