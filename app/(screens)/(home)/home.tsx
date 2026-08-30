import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import TransactionsList from "@/components/(transactions)/transaction-list";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { getHomeStyles } from "../../../styles/home.styles";

export default function HomeScreen() {
  const router = useRouter();
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

        <TransactionsList
          onNavigateToAddExpense={() => router.push("/expense-form")}
          onNavigateToAddRevenue={() => router.push("/expense-form")}
          onNavigateToEditExpense={(monthYear, id) =>
            router.push({
              pathname: "/expense-form",
              params: { monthYear, expenseId: String(id) },
            })
          }
          onNavigateToEditRevenue={(monthYear, id) =>
            router.push({
              pathname: "/expense-form",
              params: { monthYear, revenueId: String(id) },
            })
          }
        />
      </View>
    </View>
  );
}
