import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getTransactionsStyles } from "@/styles/(components)/transactions-lists.styles";
import ConfirmModal from "../(confirm-modal)/confirm-modal";
import SummaryCards from "../(summary)/summary-cards";

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

interface ModalConfig {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const MONTHS_LIST = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export default function TransactionsList({
  onNavigateToAddExpense,
  onNavigateToAddRevenue,
  onNavigateToEditExpense,
  onNavigateToEditRevenue,
}: TransactionsListProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getTransactionsStyles(colors, isMobile);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allRevenues, setAllRevenues] = useState<Revenue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [monthYearFilter, setMonthYearFilter] = useState<Date>(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);

  // Estado unificado para controle do ConfirmModal
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  const totalExpenses = expenses.reduce(
    (acc, item) => acc + item.valueExpense,
    0
  );
  const totalRevenues = revenues.reduce(
    (acc, item) => acc + item.valueRevenue,
    0
  );

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

  const getValidIconName = (
    iconName?: string,
    defaultIcon: keyof typeof Ionicons.glyphMap = "cash-outline"
  ): keyof typeof Ionicons.glyphMap => {
    if (!iconName) return defaultIcon;
    const cleanName = iconName.replace(/^pi\s+pi-|^pi-/, "").trim();
    const map: Record<string, keyof typeof Ionicons.glyphMap> = {
      tablet: "tablet-portrait-outline",
      "heart-fill": "heart",
      "credit-card": "card-outline",
      user: "person-outline",
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
    return (Ionicons.glyphMap as any)[resolved]
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
    }
  };

  const deleteExpense = async (expense: Expense) => {
    closeModal();
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(expense.dateExpense));
      await api.delete(`/expenses/${monthYear}/${expense.id}`);
      loadInitialData();
    } catch (err) {
      console.error("Falha ao excluir despesa", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRevenue = async (revenue: Revenue) => {
    closeModal();
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(revenue.dateRevenue));
      await api.delete(`/revenues/${monthYear}/${revenue.id}`);
      loadInitialData();
    } catch (err) {
      console.error("Falha ao excluir receita", err);
    } finally {
      setIsLoading(false);
    }
  };

  const replicateExpense = async (expense: Expense) => {
    closeModal();
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(expense.dateExpense));
      await api.post(`/expenses/${monthYear}/${expense.id}/replicate`);
      loadInitialData();
    } catch (err) {
      console.error("Falha ao replicar despesa", err);
    } finally {
      setIsLoading(false);
    }
  };

  const replicateRevenue = async (revenue: Revenue) => {
    closeModal();
    setIsLoading(true);
    try {
      const monthYear = getMonthYearKey(new Date(revenue.dateRevenue));
      await api.post(`/revenues/${monthYear}/${revenue.id}/replicate`);
      loadInitialData();
    } catch (err) {
      console.error("Falha ao replicar receita", err);
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

  // Funções de confirmação utilizando o ConfirmModal
  const confirmDeleteExpense = (expense: Expense) => {
    setModalConfig({
      visible: true,
      title: "Excluir despesa",
      message: `Deseja excluir "${expense.nameExpense}"?`,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: () => deleteExpense(expense),
    });
  };

  const confirmDeleteRevenue = (revenue: Revenue) => {
    setModalConfig({
      visible: true,
      title: "Excluir receita",
      message: `Deseja excluir "${revenue.nameRevenue}"?`,
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: () => deleteRevenue(revenue),
    });
  };

  const confirmReplicateExpense = (expense: Expense) => {
    setModalConfig({
      visible: true,
      title: "Replicar despesa",
      message: `Replicar "${expense.nameExpense}" para o próximo mês?`,
      confirmText: "Replicar",
      cancelText: "Cancelar",
      onConfirm: () => replicateExpense(expense),
    });
  };

  const confirmReplicateRevenue = (revenue: Revenue) => {
    setModalConfig({
      visible: true,
      title: "Replicar receita",
      message: `Replicar "${revenue.nameRevenue}" para o próximo mês?`,
      confirmText: "Replicar",
      cancelText: "Cancelar",
      onConfirm: () => replicateRevenue(revenue),
    });
  };

  const currentSelectedMonth = monthYearFilter.getMonth();
  const currentSelectedYear = monthYearFilter.getFullYear();

  const handleSelectMonth = (monthIndex: number) => {
    const updatedDate = new Date(monthYearFilter);
    updatedDate.setMonth(monthIndex);
    setMonthYearFilter(updatedDate);
    setShowMonthPicker(false);
  };

  const handleYearChange = (delta: number) => {
    const updatedDate = new Date(monthYearFilter);
    updatedDate.setFullYear(updatedDate.getFullYear() + delta);
    setMonthYearFilter(updatedDate);
  };

  const handleSetCurrentMonth = () => {
    const now = new Date();
    setMonthYearFilter(new Date(now.getFullYear(), now.getMonth(), 1));
    setShowMonthPicker(false);
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCards
          totalExpenses={totalExpenses}
          totalRevenues={totalRevenues}
        />

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        )}

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filtrar por Mês/Ano</Text>

          <TouchableOpacity
            style={styles.customPickerTrigger}
            activeOpacity={0.7}
            onPress={() => setShowMonthPicker((prev) => !prev)}
          >
            <Text style={styles.customPickerText}>
              {/* Caso queira deixa Agosto De 2026  no filtro colocar  month: "long"*/}
              {monthYearFilter.toLocaleDateString("pt-BR", {
                month: "numeric",
                year: "numeric",
              })}
            </Text>

            <View style={styles.iconContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.black}
              />
            </View>
          </TouchableOpacity>

          {showMonthPicker && (
            <View style={styles.popoverCard}>
              <View style={styles.popoverHeader}>
                <TouchableOpacity
                  onPress={() => handleYearChange(-1)}
                  style={styles.arrowButton}
                >
                  <Ionicons name="chevron-back" size={18} color={colors.gray} />
                </TouchableOpacity>
                <Text style={styles.popoverYearText}>
                  {currentSelectedYear}
                </Text>
                <TouchableOpacity
                  onPress={() => handleYearChange(1)}
                  style={styles.arrowButton}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.monthsGrid}>
                {MONTHS_LIST.map((monthName, index) => {
                  const isSelected = index === currentSelectedMonth;
                  return (
                    <TouchableOpacity
                      key={monthName}
                      style={[
                        styles.monthGridItem,
                        isSelected && styles.monthGridItemSelected,
                      ]}
                      onPress={() => handleSelectMonth(index)}
                    >
                      <Text
                        style={[
                          styles.monthGridText,
                          isSelected && styles.monthGridTextSelected,
                        ]}
                      >
                        {monthName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.popoverFooter}>
                <TouchableOpacity onPress={handleSetCurrentMonth}>
                  <Text style={styles.footerActionText}>Este mês</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.listsWrapper}>
          {/* Bloco de Despesas */}
          <View style={styles.columnContainer}>
            <Text style={styles.sectionTitle}>Despesas</Text>

            <View style={styles.cardSection}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  saveFilterState();
                  onNavigateToAddExpense?.();
                }}
              >
                <Text style={styles.addButtonText}>Adicionar despesa</Text>
              </TouchableOpacity>

              <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.itemRow}>
                    {/* Checkbox */}
                    <TouchableOpacity
                      onPress={() => toggleExpensePaidStatus(item)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: 1.5,
                          borderColor: colors.checkmarkOut,
                          backgroundColor: item.isPaid
                            ? colors.checkmarkOut
                            : "transparent",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.isPaid && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={colors.checkmark}
                          />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Ícone */}
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: item.color || colors.primary },
                      ]}
                    >
                      <Ionicons
                        name={getValidIconName(item.icon, "barcode-outline")}
                        size={28}
                        color="#fff"
                      />
                    </View>

                    {/* Detalhes (Nome, Data e Valor juntos) */}
                    <View style={styles.itemDetails}>
                      <Text
                        style={[
                          styles.itemName,
                          item.isPaid && styles.paidText,
                        ]}
                        numberOfLines={1}
                      >
                        {item.nameExpense}
                      </Text>

                      <View style={styles.dateAndAmountRow}>
                        <Text style={styles.itemDate}>
                          {formatDate(item.dateExpense)}
                        </Text>
                        <Text
                          style={[
                            styles.itemAmount,
                            item.isPaid && styles.paidText,
                          ]}
                        >
                          {formatCurrency(item.valueExpense)}
                        </Text>
                      </View>
                    </View>

                    {/* Ações (Editar, Deletar, Replicar) */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => handleEditExpense(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={22}
                          color={colors.neonGreen}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmDeleteExpense(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="remove-circle-outline"
                          size={22}
                          color={colors.red}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmReplicateExpense(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="arrow-forward-outline"
                          size={22}
                          color={colors.blue}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Bloco de Receitas */}
          <View style={styles.columnContainer}>
            <Text style={styles.sectionTitle}>Receitas/Salários</Text>

            <View style={styles.cardSection}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  saveFilterState();
                  onNavigateToAddRevenue?.();
                }}
              >
                <Text style={styles.addButtonText}>Adicionar receita</Text>
              </TouchableOpacity>

              <FlatList
                data={revenues}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.itemRow}>
                    {/* Ícone */}
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

                    {/* Detalhes (Nome, Data e Valor juntos) */}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.nameRevenue}
                      </Text>

                      <View style={styles.dateAndAmountRow}>
                        <Text style={styles.itemDate}>
                          {formatDate(item.dateRevenue)}
                        </Text>
                        <Text style={styles.itemAmount}>
                          {formatCurrency(item.valueRevenue)}
                        </Text>
                      </View>
                    </View>

                    {/* Ações (Editar, Deletar, Replicar) */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => handleEditRevenue(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="create-outline"
                          size={22}
                          color={colors.neonGreen}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmDeleteRevenue(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="remove-circle-outline"
                          size={22}
                          color={colors.red}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmReplicateRevenue(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="arrow-forward-outline"
                          size={22}
                          color={colors.blue}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Genérico de Confirmação para Web e Mobile */}
      <ConfirmModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onCancel={closeModal}
        onConfirm={modalConfig.onConfirm}
      />
    </>
  );
}
