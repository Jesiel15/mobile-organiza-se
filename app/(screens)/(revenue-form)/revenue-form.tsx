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

export default function FormRevenueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monthYear?: string;
    revenueId?: string;
  }>();

  const monthYear = Array.isArray(params.monthYear)
    ? params.monthYear[0]
    : params.monthYear;
  const revenueId = Array.isArray(params.revenueId)
    ? params.revenueId[0]
    : params.revenueId;

  const isEditing = Boolean(monthYear && revenueId);

  // Tema, Paleta e Responsividade
  const { colors } = useTheme();
  const paletteColors = getPaletteColors(colors);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getExpenseRevenueFormStyles(colors, isMobile);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Estados do Formulário
  const [nameRevenue, setNameRevenue] = useState("");
  const [valueRevenue, setValueRevenue] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [anotation, setAnotation] = useState("");
  const [color, setColor] = useState(colors.green || "#48BB78");
  const [icon, setIcon] = useState<string>("wallet-outline");

  // Modais / Popovers
  const [showIconModal, setShowIconModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Estado para o AlertModal
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
      loadRevenueData(isMounted);
    } else {
      resetForm();
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [monthYear, revenueId]);

  const resetForm = () => {
    setNameRevenue("");
    setValueRevenue("");
    setDisplayDate(new Date().toLocaleDateString("pt-BR"));
    setAnotation("");
    setColor(colors.green || "#48BB78");
    setIcon("wallet-outline");
  };

  const loadRevenueData = async (isMounted: boolean) => {
    try {
      setLoading(true);
      const response = await api.get(`/revenues/${monthYear}/${revenueId}`);
      const revenue = response.data?.data || response.data;

      if (!isMounted) return;

      setNameRevenue(revenue.nameRevenue || revenue.nameExpense || "");

      const rawValue =
        revenue.valueRevenue || revenue.valueExpense
          ? Math.round(
              (revenue.valueRevenue || revenue.valueExpense) * 100
            ).toString()
          : "0";
      setValueRevenue(formatCurrency(rawValue));

      if (revenue.dateRevenue || revenue.dateExpense) {
        const rawDate = (revenue.dateRevenue || revenue.dateExpense).split(
          "T"
        )[0];
        const [year, month, day] = rawDate.split("-");
        if (year && month && day) {
          setDisplayDate(`${day}/${month}/${year}`);
        }
      }

      setAnotation(revenue.anotation || "");
      setColor(revenue.color || colors.green || "#48BB78");
      setIcon(revenue.icon || "wallet-outline");
    } catch (error) {
      console.error("Erro ao carregar receita:", error);
      showAlert("Erro", "Não foi possível carregar os dados da receita.", () =>
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
    if (!nameRevenue || !valueRevenue) {
      showAlert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const numericValue = parseFloat(valueRevenue.replace(/\D/g, "")) / 100;

      let isoDate = new Date().toISOString();
      if (displayDate.length === 10) {
        const [day, month, year] = displayDate.split("/");
        isoDate = new Date(
          `${year}-${month}-${day}T00:00:00.000Z`
        ).toISOString();
      }

      const payload = {
        nameRevenue,
        valueRevenue: numericValue,
        dateRevenue: isoDate,
        anotation,
        color,
        icon,
      };

      if (isEditing) {
        await api.put(`/revenues/${monthYear}/${revenueId}`, payload);
        showAlert("Sucesso", "Receita atualizada com sucesso!", () =>
          router.back()
        );
      } else {
        await api.post("/revenues", payload);
        showAlert("Sucesso", "Receita criada com sucesso!", () =>
          router.back()
        );
      }
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      showAlert(
        "Erro",
        isEditing ? "Falha ao editar receita." : "Falha ao criar receita."
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
              {isEditing ? "Editar receita" : "Adicionar receita"}
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
              placeholder="Nome da receita"
              placeholderTextColor={colors.gray}
              value={nameRevenue}
              onChangeText={setNameRevenue}
              style={styles.input}
            />

            <TextInput
              placeholder="Valor da receita"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              value={valueRevenue}
              onChangeText={(val) => setValueRevenue(formatCurrency(val))}
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
                    : "Adicionar Receita"}
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

      {/* Modal de Alerta Customizado */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </View>
  );
}
