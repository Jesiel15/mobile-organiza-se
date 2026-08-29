import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { styles } from "@/styles/(components)/transactions-lists.styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export interface Expense {
  id: string;
  nameExpense: string;
  valueExpense: number;
  dateExpense: string | Date;
  isPaid: boolean;
  color?: string;
  icon?: string;
}

export interface Revenue {
  id: string;
  nameRevenue: string;
  valueRevenue: number;
  dateRevenue: string | Date;
  color?: string;
  icon?: string;
}

interface TransactionsListProps {
  onNavigateToAddExpense?: () => void;
  onNavigateToAddRevenue?: () => void;
  onNavigateToEditExpense?: (monthYear: string, id: string) => void;
  onNavigateToEditRevenue?: (monthYear: string, id: string) => void;
}

export default function TransactionsList({
  onNavigateToAddExpense,
  onNavigateToAddRevenue,
  onNavigateToEditExpense,
  onNavigateToEditRevenue,
}: TransactionsListProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allRevenues, setAllRevenues] = useState<Revenue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [monthYearFilter, setMonthYearFilter] = useState<Date>(new Date());

  const getMonthYearKey = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${month}${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("pt-BR");
  };

  /**
   * Helper para sanitizar nomes de ícones legados (PrimeNG/Outros -> Ionicons)
   */
  const getValidIconName = (
    iconName?: string,
    defaultIcon: keyof typeof Ionicons.glyphMap = "cash-outline"
  ): keyof typeof Ionicons.glyphMap => {
    if (!iconName) return defaultIcon;

    // Limpa prefixos 'pi' ou 'pi-' caso existam
    const cleanName = iconName.replace(/^pi\s+pi-|^pi-/, "").trim();

    // Dicionário de tradução de ícones legados/inválidos para Ionicons válidos
    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
      // Correções para os alertas atuais:
      tablet: "tablet-portrait-outline",
      "heart-fill": "heart",
      "credit-card": "card-outline",
      user: "person-outline",

      // Outros ícones comuns do PrimeNG / FontAwesome:
      dollar: "cash-outline",
      "money-bill": "cash-outline",
      wallet: "wallet-outline",
      receipt: "receipt-outline",
      barcode: "barcode-outline",
      users: "people-outline",
      briefcase: "briefcase-outline",
      building: "business-outline",
      home: "home-outline",
      car: "car-outline",
      phone: "call-outline",
      gift: "gift-outline",
      star: "star-outline",
      heart: "heart-outline",
    };

    const resolved = map[cleanName] || cleanName;

    // Validação final de segurança para evitar que uma string inválida passe
    const validIonicons = [
      "tablet-portrait-outline",
      "heart",
      "card-outline",
      "person-outline",
      "cash-outline",
      "wallet-outline",
      "receipt-outline",
      "barcode-outline",
      "people-outline",
      "briefcase-outline",
      "business-outline",
      "home-outline",
      "car-outline",
      "call-outline",
      "gift-outline",
      "star-outline",
      "heart-outline",
    ];

    return validIonicons.includes(resolved)
      ? (resolved as keyof typeof Ionicons.glyphMap)
      : defaultIcon;
  };

  const applyFilter = useCallback(
    (expenseData: Expense[], revenueData: Revenue[], filterDate: Date) => {
      const selectedMonth = filterDate.getMonth();
      const selectedYear = filterDate.getFullYear();

      const filteredExpenses = expenseData.filter((exp) => {
        const d = new Date(exp.dateExpense);
        return (
          d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
        );
      });

      const filteredRevenues = revenueData.filter((rev) => {
        const d = new Date(rev.dateRevenue);
        return (
          d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
        );
      });

      setExpenses(filteredExpenses);
      setRevenues(filteredRevenues);
    },
    []
  );

  useEffect(() => {
    applyFilter(allExpenses, allRevenues, monthYearFilter);
  }, [monthYearFilter, allExpenses, allRevenues, applyFilter]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const savedFilter = await AsyncStorage.getItem("transactionsFilter");
      let initialDate = new Date();
      initialDate.setDate(1);

      if (savedFilter) {
        const month = parseInt(savedFilter.substring(0, 2), 10) - 1;
        const year = parseInt(savedFilter.substring(2, 6), 10);
        initialDate = new Date(year, month, 1);
        await AsyncStorage.removeItem("transactionsFilter");
      }
      setMonthYearFilter(initialDate);

      const [resExp, resRev] = await Promise.all([
        api.get("/expenses"),
        api.get("/revenues"),
      ]);

      const expensesArray = resExp.data?.data || resExp.data || [];
      const formattedExpenses: Expense[] = expensesArray.map((exp: any) => ({
        ...exp,
        id: exp.id || exp._id,
        dateExpense: new Date(exp.dateExpense),
        isPaid: exp.isPaid || false,
      }));

      const revenuesArray = resRev.data?.data || resRev.data || [];
      const formattedRevenues: Revenue[] = revenuesArray.map((rev: any) => ({
        ...rev,
        id: rev.id || rev._id,
        dateRevenue: new Date(rev.dateRevenue),
      }));

      setAllExpenses(formattedExpenses);
      setAllRevenues(formattedRevenues);
      applyFilter(formattedExpenses, formattedRevenues, initialDate);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const saveFilterState = async () => {
    const monthYearKey = getMonthYearKey(monthYearFilter);
    await AsyncStorage.setItem("transactionsFilter", monthYearKey);
  };

  const toggleExpensePaidStatus = async (expense: Expense) => {
    const updatedPaidStatus = !expense.isPaid;

    setExpenses((prev) =>
      prev.map((item) =>
        item.id === expense.id ? { ...item, isPaid: updatedPaidStatus } : item
      )
    );

    try {
      const monthYear = getMonthYearKey(new Date(expense.dateExpense));
      await api.patch(`/expenses/${monthYear}/${expense.id}`, {
        isPaid: updatedPaidStatus,
      });
    } catch (err) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === expense.id ? { ...item, isPaid: expense.isPaid } : item
        )
      );
      Alert.alert("Erro", "Não foi possível atualizar o status da despesa.");
    }
  };

  const deleteExpense = async (expense: Expense) => {
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(expense.dateExpense));
      await api.delete(`/expenses/${monthYear}/${expense.id}`);
      loadInitialData();
    } catch (err) {
      Alert.alert("Erro", "Falha ao excluir despesa.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRevenue = async (revenue: Revenue) => {
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(revenue.dateRevenue));
      await api.delete(`/revenues/${monthYear}/${revenue.id}`);
      loadInitialData();
    } catch (err) {
      Alert.alert("Erro", "Falha ao excluir receita.");
    } finally {
      setIsLoading(false);
    }
  };

  const replicateExpense = async (expense: Expense) => {
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(expense.dateExpense));
      await api.post(`/expenses/${monthYear}/${expense.id}/replicate`);
      Alert.alert("Sucesso", "Despesa replicada para o próximo mês!");
      loadInitialData();
    } catch (err) {
      Alert.alert("Erro", "Falha ao replicar despesa.");
    } finally {
      setIsLoading(false);
    }
  };

  const replicateRevenue = async (revenue: Revenue) => {
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(revenue.dateRevenue));
      await api.post(`/revenues/${monthYear}/${revenue.id}/replicate`);
      Alert.alert("Sucesso", "Receita replicada para o próximo mês!");
      loadInitialData();
    } catch (err) {
      Alert.alert("Erro", "Falha ao replicar receita.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    saveFilterState();
    const dateObj = new Date(expense.dateExpense);
    const monthYear = getMonthYearKey(dateObj);
    onNavigateToEditExpense?.(monthYear, expense.id);
  };

  const handleEditRevenue = (revenue: Revenue) => {
    saveFilterState();
    const dateObj = new Date(revenue.dateRevenue);
    const monthYear = getMonthYearKey(dateObj);
    onNavigateToEditRevenue?.(monthYear, revenue.id);
  };

  const confirmDeleteExpense = (expense: Expense) => {
    Alert.alert("Excluir despesa", `Deseja excluir "${expense.nameExpense}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        style: "destructive",
        onPress: () => deleteExpense(expense),
      },
    ]);
  };

  const confirmDeleteRevenue = (revenue: Revenue) => {
    Alert.alert("Excluir receita", `Deseja excluir "${revenue.nameRevenue}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        style: "destructive",
        onPress: () => deleteRevenue(revenue),
      },
    ]);
  };

  const confirmReplicateExpense = (expense: Expense) => {
    Alert.alert(
      "Replicar despesa",
      `Replicar "${expense.nameExpense}" para o próximo mês?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => replicateExpense(expense) },
      ]
    );
  };

  const confirmReplicateRevenue = (revenue: Revenue) => {
    Alert.alert(
      "Replicar receita",
      `Replicar "${revenue.nameRevenue}" para o próximo mês?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => replicateRevenue(revenue) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      )}

      <View
        style={[
          styles.listsWrapper,
          { flexDirection: isMobile ? "column" : "row" },
        ]}
      >
        {/* Bloco de Despesas */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            Despesas
          </Text>

          <View
            style={[
              styles.cardSection,
              { backgroundColor: colors.white || "#FFFFFF" },
            ]}
          >
            <TouchableOpacity
              style={[styles.addButton, { borderColor: "#D0D5DD" }]}
              onPress={() => {
                saveFilterState();
                onNavigateToAddExpense?.();
              }}
            >
              <Text
                style={{ color: "#475467", fontWeight: "500", fontSize: 13 }}
              >
                Adicionar despesa
              </Text>
            </TouchableOpacity>

            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <TouchableOpacity
                    onPress={() => toggleExpensePaidStatus(item)}
                  >
                    <Ionicons
                      name={item.isPaid ? "checkbox" : "square-outline"}
                      size={20}
                      color={item.isPaid ? "#98A2B3" : "#D0D5DD"}
                    />
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: item.color || "#6172F3" },
                    ]}
                  >
                    <Ionicons
                      name={getValidIconName(item.icon, "barcode-outline")}
                      size={16}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.itemDetails}>
                    <Text
                      style={[
                        styles.itemName,
                        { color: colors.textColor },
                        item.isPaid && styles.paidText,
                      ]}
                      numberOfLines={1}
                    >
                      {item.nameExpense}
                    </Text>
                    <Text style={styles.itemDate}>
                      {formatDate(item.dateExpense)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.itemAmount,
                      { color: colors.textColor },
                      item.isPaid && styles.paidText,
                    ]}
                  >
                    {formatCurrency(item.valueExpense)}
                  </Text>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => handleEditExpense(item)}>
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#667085"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmDeleteExpense(item)}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={18}
                        color="#F04438"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmReplicateExpense(item)}
                    >
                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color="#2E90FA"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        {/* Bloco de Receitas */}
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.textColor }]}>
            Receitas/Salários
          </Text>

          <View
            style={[
              styles.cardSection,
              { backgroundColor: colors.white || "#FFFFFF" },
            ]}
          >
            <TouchableOpacity
              style={[styles.addButton, { borderColor: "#D0D5DD" }]}
              onPress={() => {
                saveFilterState();
                onNavigateToAddRevenue?.();
              }}
            >
              <Text
                style={{ color: "#475467", fontWeight: "500", fontSize: 13 }}
              >
                Adicionar receita
              </Text>
            </TouchableOpacity>

            <FlatList
              data={revenues}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: item.color || "#D92D20" },
                    ]}
                  >
                    <Ionicons
                      name={getValidIconName(item.icon, "cash-outline")}
                      size={16}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.itemDetails}>
                    <Text
                      style={[styles.itemName, { color: colors.textColor }]}
                      numberOfLines={1}
                    >
                      {item.nameRevenue}
                    </Text>
                    <Text style={styles.itemDate}>
                      {formatDate(item.dateRevenue)}
                    </Text>
                  </View>

                  <Text
                    style={[styles.itemAmount, { color: colors.textColor }]}
                  >
                    {formatCurrency(item.valueRevenue)}
                  </Text>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => handleEditRevenue(item)}>
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#667085"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmDeleteRevenue(item)}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={18}
                        color="#F04438"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmReplicateRevenue(item)}
                    >
                      <Ionicons
                        name="arrow-forward-outline"
                        size={18}
                        color="#2E90FA"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
