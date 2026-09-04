import React from "react";
import {
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import getSummaryCardsStyles from "@/styles/(components)/summary-cards.styles";

interface SummaryCardsProps {
  totalExpenses: number;
  totalRevenues: number;
  isLoading?: boolean;
}

export default function SummaryCards({
  totalExpenses,
  totalRevenues,
  isLoading = false,
}: SummaryCardsProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getSummaryCardsStyles(colors, isMobile);

  const balance = totalRevenues - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const renderValue = (content: string, textStyle: object) => {
    if (isLoading) {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            height: 32,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary || "#000000"} />
        </View>
      );
    }

    return <Text style={[styles.cardValue, textStyle]}>{content}</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Total Despesas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total despesas</Text>
        {renderValue(
          formatCurrency(-Math.abs(totalExpenses)),
          styles.expenseText
        )}
      </View>

      {/* Total Receitas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total receitas</Text>
        {renderValue(formatCurrency(totalRevenues), styles.revenueText)}
      </View>

      {/* Saldo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo</Text>
        {renderValue(
          formatCurrency(balance),
          balance >= 0 ? styles.positiveBalanceText : styles.expenseText
        )}
      </View>
    </View>
  );
}
