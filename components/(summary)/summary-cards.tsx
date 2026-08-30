import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import getSummaryCardsStyles from "@/styles/(components)/summary-cards.styles";

interface SummaryCardsProps {
  totalExpenses: number;
  totalRevenues: number;
}

export default function SummaryCards({
  totalExpenses,
  totalRevenues,
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

  return (
    <View style={styles.container}>
      {/* Total Despesas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total despesas</Text>
        <Text style={[styles.cardValue, styles.expenseText]}>
          {formatCurrency(-Math.abs(totalExpenses))}
        </Text>
      </View>

      {/* Total Receitas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total receitas</Text>
        <Text style={[styles.cardValue, styles.revenueText]}>
          {formatCurrency(totalRevenues)}
        </Text>
      </View>

      {/* Saldo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo</Text>
        <Text
          style={[
            styles.cardValue,
            balance >= 0 ? styles.positiveBalanceText : styles.expenseText,
          ]}
        >
          {formatCurrency(balance)}
        </Text>
      </View>
    </View>
  );
}
