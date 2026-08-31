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
  const [displayDate, setDisplayDate] = useState("");
  const [anotation, setAnotation] = useState("");
  const [color, setColor] = useState(colors.red);
  const [icon, setIcon] = useState<string>("barcode-outline");

  // Popovers
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
    const navigationCallback = alertConfig.onClose;

    // 1. Oculta a modal primeiro
    setAlertConfig((prev) => ({ ...prev, visible: false }));

    // 2. Se houver callback (ex: router.back()), aguarda a animação fechar
    if (navigationCallback) {
      setTimeout(() => {
        navigationCallback();
      }, 150); // 150ms é o suficiente para o unmount do fade
    }
  };

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
    setDisplayDate(new Date().toLocaleDateString("pt-BR"));
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
        const rawDate = expense.dateExpense.split("T")[0];
        const [year, month, day] = rawDate.split("-");
        if (year && month && day) {
          setDisplayDate(`${day}/${month}/${year}`);
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
    const numericValue = parseInt(cleanValue || "0", 10) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4
      )}/${cleaned.slice(4, 8)}`;
    }

    setDisplayDate(formatted);
  };

  const handleSave = async () => {
    if (!nameExpense || !valueExpense) {
      showAlert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const numericValue = parseFloat(valueExpense.replace(/\D/g, "")) / 100;

      let isoDate = new Date().toISOString();
      if (displayDate.length === 10) {
        const [day, month, year] = displayDate.split("/");
        isoDate = new Date(
          `${year}-${month}-${day}T00:00:00.000Z`
        ).toISOString();
      }

      const payload = {
        nameExpense,
        valueExpense: numericValue,
        dateExpense: isoDate,
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
                <Text style={styles.label}>Selecione o ícone:</Text>
                <TouchableOpacity
                  style={[styles.iconBox, { backgroundColor: color }]}
                  onPress={() => setShowIconModal(true)}
                >
                  <Ionicons name={icon as any} size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.selectorItem}>
                <Text style={styles.label}>Selecione a cor:</Text>
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

            {/* Campos de Texto */}
            <TextInput
              placeholder="Nome da despesa"
              placeholderTextColor={colors.gray}
              value={nameExpense}
              onChangeText={setNameExpense}
              style={styles.input}
            />

            <TextInput
              placeholder="Valor da despesa"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={valueExpense}
              onChangeText={(val) => setValueExpense(formatCurrency(val))}
              style={styles.input}
            />

            <TextInput
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              maxLength={10}
              value={displayDate}
              onChangeText={handleDateChange}
              style={[styles.input, styles.dateInput]}
            />

            <TextInput
              placeholder="Anotação"
              placeholderTextColor={colors.gray}
              value={anotation}
              onChangeText={setAnotation}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />

            {/* Botões */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={submitting}
                style={[
                  styles.btn,
                  styles.btnSave,
                  submitting && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.btnText}>
                  {submitting
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar Alterações"
                    : "Adicionar Despesa"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.btn, styles.btnCancel]}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Modal de Seleção de Ícones */}
      <Modal visible={showIconModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Ícone</Text>
              <TouchableOpacity onPress={() => setShowIconModal(false)}>
                <Ionicons name="close" size={24} color={colors.textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.iconGrid}>
              {ListIcons.map((item: any) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.iconTile,
                    icon === item && styles.iconTileSelected,
                  ]}
                  onPress={() => {
                    setIcon(item);
                    setShowIconModal(false);
                  }}
                >
                  <Ionicons
                    name={item as any}
                    size={24}
                    color={colors.iconeOutColor}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowIconModal(false)}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Novo Modal de Alerta */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </View>
  );
}
