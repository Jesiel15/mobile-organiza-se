import AlertModal from "@/components/(alert-modal)/alert-modal";
import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { ListIcons } from "@/constants/list-icons";
import { getPaletteColors } from "@/constants/palette-colors";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getExpenseRevenueFormStyles } from "@/styles/(components)/expense-revenue-form.styles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function FormExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monthYear?: string;
    expenseId?: string;
    revenueId?: string;
  }>();

  const monthYear = Array.isArray(params.monthYear)
    ? params.monthYear[0]
    : params.monthYear;
  const expenseId = Array.isArray(params.expenseId)
    ? params.expenseId[0]
    : params.expenseId;
  const revenueId = Array.isArray(params.revenueId)
    ? params.revenueId[0]
    : params.revenueId;

  const currentId = expenseId || revenueId;
  const isEditing = Boolean(monthYear && currentId);

  // Tema, Paleta e Responsividade
  const { colors } = useTheme();
  const paletteColors = getPaletteColors(colors);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getExpenseRevenueFormStyles(colors, isMobile);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Estados do Formulário
  const [nameExpense, setNameExpense] = useState("");
  const [valueExpense, setValueExpense] = useState("");

  // Estado de Data e Popover
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateInputText, setDateInputText] = useState<string>("");
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");

  const [anotation, setAnotation] = useState("");
  const [color, setColor] = useState(colors.red);
  const [icon, setIcon] = useState<string>("barcode-outline");

  // Outline do campo Data
  const [isDateFocused, setIsDateFocused] = useState(false);

  // Popovers de Ícone e Cor
  const [showIconModal, setShowIconModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Estado para a AlertModal
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const showAlert = (title: string, message: string, onClose?: () => void) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onClose,
    });
  };

  const closeAlert = () => {
    const callback = alertConfig.onClose;
    setAlertConfig({
      visible: false,
      title: "",
      message: "",
      onClose: undefined,
    });

    if (callback) {
      setTimeout(() => {
        callback();
      }, 200);
    }
  };

  // Sincroniza o texto do input sempre que selectedDate mudar (DD/MM/AAAA)
  useEffect(() => {
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const year = selectedDate.getFullYear();
    setDateInputText(`${day}/${month}/${year}`);
  }, [selectedDate]);

  useEffect(() => {
    let isMounted = true;

    if (isEditing) {
      loadExpenseData(isMounted);
    } else {
      resetForm();
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [monthYear, currentId]);

  const resetForm = () => {
    setNameExpense("");
    setValueExpense("");
    const now = new Date();
    setSelectedDate(now);
    setAnotation("");
    setColor(colors.red);
    setIcon("barcode-outline");
  };

  const loadExpenseData = async (isMounted: boolean) => {
    try {
      setLoading(true);
      const response = await api.get(`/expenses/${monthYear}/${currentId}`);
      const expense = response.data?.data || response.data;

      if (!isMounted) return;

      setNameExpense(expense.nameExpense || "");

      const rawValue = expense.valueExpense
        ? Math.round(expense.valueExpense * 100).toString()
        : "0";
      setValueExpense(formatCurrency(rawValue));

      if (expense.dateExpense) {
        const dateStr = String(expense.dateExpense).split("T")[0];
        const [year, month, day] = dateStr.split("-").map(Number);
        if (year && month && day) {
          setSelectedDate(new Date(year, month - 1, day));
        }
      }

      setAnotation(expense.anotation || "");
      setColor(expense.color || colors.red);
      setIcon(expense.icon || "barcode-outline");
    } catch (error) {
      console.error("Erro ao carregar despesa:", error);
      showAlert("Erro", "Não foi possível carregar os dados da despesa.", () =>
        router.back()
      );
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";

    const numericValue = parseInt(cleanValue, 10) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Manipulação da digitação manual com máscara DD/MM/AAAA
  const handleDateInputChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }

    setDateInputText(formatted);

    if (cleaned.length === 8) {
      const day = parseInt(cleaned.slice(0, 2), 10);
      const month = parseInt(cleaned.slice(2, 4), 10) - 1;
      const year = parseInt(cleaned.slice(4, 8), 10);

      if (
        day >= 1 &&
        day <= 31 &&
        month >= 0 &&
        month <= 11 &&
        year >= 1900 &&
        year <= 2100
      ) {
        const updatedDate = new Date(year, month, day);
        setSelectedDate(updatedDate);
      }
    }
  };

  // Funções do Calendário / Popover
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getYearsList = (currentYear: number) => {
    const startYear = currentYear - 5;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  };

  const handleSelectDay = (dayNumber: number) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setDate(dayNumber);
    setSelectedDate(updatedDate);
    setShowMonthPicker(false);
  };

  const handleSelectMonthFromPicker = (monthIndex: number) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setMonth(monthIndex);
    setSelectedDate(updatedDate);
    setViewMode("days");
  };

  const handleSelectYearFromPicker = (year: number) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(year);
    setSelectedDate(updatedDate);
    setViewMode("months");
  };

  const handleMonthChange = (delta: number) => {
    const updatedDate = new Date(selectedDate);
    if (viewMode === "years") {
      updatedDate.setFullYear(updatedDate.getFullYear() + delta * 10);
    } else if (viewMode === "months") {
      updatedDate.setFullYear(updatedDate.getFullYear() + delta);
    } else {
      updatedDate.setMonth(updatedDate.getMonth() + delta);
    }
    setSelectedDate(updatedDate);
  };

  const handleSetCurrentDate = () => {
    setSelectedDate(new Date());
    setViewMode("days");
    setShowMonthPicker(false);
  };

  const handleSave = async () => {
    const numericValue = parseFloat(valueExpense.replace(/\D/g, "")) / 100;

    if (
      !nameExpense.trim() ||
      !valueExpense ||
      isNaN(numericValue) ||
      numericValue <= 0
    ) {
      showAlert("Atenção", "Preencha o nome e um valor válido maior que zero.");
      return;
    }

    setSubmitting(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}T00:00:00`;

      const payload = {
        nameExpense,
        valueExpense: numericValue,
        dateExpense: formattedDate,
        anotation,
        color,
        icon,
      };

      if (isEditing) {
        await api.put(`/expenses/${monthYear}/${currentId}`, payload);
        showAlert("Sucesso", "Despesa atualizada com sucesso!", () =>
          router.back()
        );
      } else {
        await api.post("/expenses", payload);
        showAlert("Sucesso", "Despesa criada com sucesso!", () =>
          router.back()
        );
      }
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      showAlert(
        "Erro",
        isEditing ? "Falha ao editar despesa." : "Falha ao criar despesa."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Início" />

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.formContainer}>
            <Text style={styles.title}>
              {isEditing ? "Editar despesa" : "Adicionar despesa"}
            </Text>

            {/* Seletores de Ícone e Cor */}
            <View style={styles.selectorsRow}>
              <View style={styles.selectorItem}>
                <Text style={styles.labelIconeColor}>Selecione o ícone:</Text>
                <TouchableOpacity
                  style={[styles.iconBox, { backgroundColor: color }]}
                  onPress={() => setShowIconModal(true)}
                >
                  <Ionicons name={icon as any} size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.selectorItem}>
                <Text style={styles.labelIconeColor}>Selecione a cor:</Text>
                <TouchableOpacity
                  style={[styles.colorBox, { backgroundColor: color }]}
                  onPress={() => setShowColorPicker(!showColorPicker)}
                />
              </View>
            </View>

            {/* Color Picker Popover */}
            {showColorPicker && (
              <View style={styles.colorPickerContainer}>
                <Text style={styles.colorPickerTitle}>Escolha uma cor:</Text>
                <View style={styles.paletteGrid}>
                  {paletteColors.map((c) => {
                    const isSelected =
                      color?.toLowerCase() === c?.toLowerCase();

                    return (
                      <TouchableOpacity
                        key={c}
                        style={[
                          styles.paletteCircle,
                          { backgroundColor: c },
                          isSelected && styles.paletteCircleSelected,
                        ]}
                        onPress={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            )}

            {/* Input de Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da despesa</Text>
              <TextInput
                style={styles.input}
                value={nameExpense}
                onChangeText={setNameExpense}
                placeholder="Ex: Aluguel, Supermercado..."
                placeholderTextColor={colors.gray}
                maxLength={60}
              />
            </View>

            {/* Input de Valor */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={valueExpense}
                onChangeText={(text) => setValueExpense(formatCurrency(text))}
                keyboardType="numeric"
                placeholder="R$ 0,00"
                placeholderTextColor={colors.gray}
                maxLength={18}
              />
            </View>

            {/* Input e Seletor de Data */}
            <View style={styles.filterContainer}>
              <Text style={styles.label}>Data</Text>

              {/* Wrapper do input com indicador visual de foco */}
              <View
                style={[
                  styles.dateInputWrapper,
                  isDateFocused && styles.dateInputWrapperFocused,
                ]}
              >
                <TextInput
                  style={[
                    styles.dateTextInput,
                    {
                      outlineStyle: "none",
                      outlineWidth: 0,
                      outlineColor: "transparent",
                    } as any,
                  ]}
                  value={dateInputText}
                  onChangeText={handleDateInputChange}
                  onFocus={() => setIsDateFocused(true)}
                  onBlur={() => setIsDateFocused(false)}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                  maxLength={10}
                  underlineColorAndroid="transparent"
                />

                <TouchableOpacity
                  style={styles.calendarIconButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowMonthPicker((prev) => !prev);
                    setViewMode("days");
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {showMonthPicker && (
                <View style={styles.popoverCard}>
                  {/* Cabeçalho Interativo Mês / Ano */}
                  <View style={styles.popoverHeader}>
                    <TouchableOpacity
                      onPress={() => handleMonthChange(-1)}
                      style={styles.arrowButton}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={18}
                        color={colors.gray}
                      />
                    </TouchableOpacity>

                    <View style={styles.headerTitleGroup}>
                      <TouchableOpacity onPress={() => setViewMode("months")}>
                        <Text
                          style={[
                            styles.popoverHeaderTitle,
                            viewMode === "months" && styles.activeTitleText,
                          ]}
                        >
                          {selectedDate
                            .toLocaleDateString("pt-BR", { month: "short" })
                            .replace(".", "")}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setViewMode("years")}>
                        <Text
                          style={[
                            styles.popoverHeaderTitle,
                            viewMode === "years" && styles.activeTitleText,
                          ]}
                        >
                          {selectedDate.getFullYear()}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleMonthChange(1)}
                      style={styles.arrowButton}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.gray}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Visualização de Dias */}
                  {viewMode === "days" && (
                    <View style={styles.daysGrid}>
                      {getDaysInMonth(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth()
                      ).map((dateObj) => {
                        const dayNumber = dateObj.getDate();
                        const isSelected = dayNumber === selectedDate.getDate();

                        return (
                          <TouchableOpacity
                            key={dayNumber}
                            style={[
                              styles.dayGridItem,
                              isSelected && styles.dayGridItemSelected,
                            ]}
                            onPress={() => handleSelectDay(dayNumber)}
                          >
                            <Text
                              style={[
                                styles.dayGridText,
                                isSelected && styles.dayGridTextSelected,
                              ]}
                            >
                              {dayNumber}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* Visualização de Meses */}
                  {viewMode === "months" && (
                    <View style={styles.pickerGrid}>
                      {MONTHS_SHORT.map((monthName, index) => {
                        const isSelected = index === selectedDate.getMonth();
                        return (
                          <TouchableOpacity
                            key={monthName}
                            style={[
                              styles.pickerGridItem,
                              isSelected && styles.pickerGridItemSelected,
                            ]}
                            onPress={() => handleSelectMonthFromPicker(index)}
                          >
                            <Text
                              style={[
                                styles.pickerGridText,
                                isSelected && styles.pickerGridTextSelected,
                              ]}
                            >
                              {monthName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* Visualização de Anos */}
                  {viewMode === "years" && (
                    <View style={styles.pickerGrid}>
                      {getYearsList(selectedDate.getFullYear()).map((year) => {
                        const isSelected = year === selectedDate.getFullYear();
                        return (
                          <TouchableOpacity
                            key={year}
                            style={[
                              styles.pickerGridItem,
                              isSelected && styles.pickerGridItemSelected,
                            ]}
                            onPress={() => handleSelectYearFromPicker(year)}
                          >
                            <Text
                              style={[
                                styles.pickerGridText,
                                isSelected && styles.pickerGridTextSelected,
                              ]}
                            >
                              {year}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  <View style={styles.popoverFooter}>
                    <TouchableOpacity onPress={handleSetCurrentDate}>
                      <Text style={styles.footerActionText}>Hoje</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Anotação */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Anotação</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={anotation}
                onChangeText={setAnotation}
                multiline
                numberOfLines={3}
                placeholder="Observações adicionais..."
                placeholderTextColor={colors.gray}
                maxLength={500}
              />
            </View>

            {/* Botões de Ação */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Modal de Seleção de Ícone */}
      <Modal
        visible={showIconModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIconModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha um ícone</Text>
            <ScrollView contentContainerStyle={styles.iconGrid}>
              {ListIcons.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconGridItem,
                    icon === iconName && styles.iconGridItemSelected,
                  ]}
                  onPress={() => {
                    setIcon(iconName);
                    setShowIconModal(false);
                  }}
                >
                  <Ionicons
                    name={iconName as any}
                    size={28}
                    color={icon === iconName ? color : colors.iconeOutColor}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowIconModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </View>
  );
}
