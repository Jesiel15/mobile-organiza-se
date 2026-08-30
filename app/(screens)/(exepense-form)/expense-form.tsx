import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FormExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monthYear?: string;
    expenseId?: string;
    revenueId?: string;
  }>();

  // Normalização dos parâmetros
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
  const { colors } = useTheme();

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Estados do Formulário
  const [nameExpense, setNameExpense] = useState("");
  const [valueExpense, setValueExpense] = useState("");
  const [dateExpense, setDateExpense] = useState("");
  const [anotation, setAnotation] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [icon, setIcon] = useState("barcode-outline");

  useEffect(() => {
    let isMounted = true;

    if (isEditing) {
      loadExpenseData(isMounted);
    } else {
      // Limpa formulário se for modo de criação
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
    setDateExpense("");
    setAnotation("");
    setColor("#ff0000");
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
        setDateExpense(rawDate);
      }

      setAnotation(expense.anotation || "");
      setColor(expense.color || "#ff0000");
      setIcon(expense.icon || "barcode-outline");
    } catch (error) {
      console.error("Erro ao carregar despesa:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da despesa.");
      router.back();
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

  const handleSave = async () => {
    if (!nameExpense || !valueExpense) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const numericValue = parseFloat(valueExpense.replace(/\D/g, "")) / 100;

      let finalDate = dateExpense;
      if (!finalDate) {
        finalDate = new Date().toISOString();
      } else if (!finalDate.includes("T")) {
        finalDate = new Date(finalDate).toISOString();
      }

      const payload = {
        nameExpense,
        valueExpense: numericValue,
        dateExpense: finalDate,
        anotation,
        color,
        icon,
      };

      if (isEditing) {
        await api.put(`/expenses/${monthYear}/${currentId}`, payload);
        Alert.alert("Sucesso", "Despesa atualizada com sucesso!");
      } else {
        await api.post("/expenses", payload);
        Alert.alert("Sucesso", "Despesa criada com sucesso!");
      }

      router.back();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      Alert.alert(
        "Erro",
        isEditing ? "Falha ao editar despesa." : "Falha ao criar despesa."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {/* Mantém a Sidebar visível mesmo durante o carregamento */}
      <Sidebar activeScreen="Início" />

      <View style={{ flex: 1 }}>
        {loading ? (
          /* O carregamento fica contido apenas na área de conteúdo */
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 12, color: colors.textColor }}>
              Carregando dados...
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
                color: colors.textColor,
              }}
            >
              {isEditing ? "Editar despesa" : "Adicionar despesa"}
            </Text>

            <TextInput
              placeholder="Nome da despesa"
              value={nameExpense}
              onChangeText={setNameExpense}
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />

            <TextInput
              placeholder="Valor da despesa"
              keyboardType="numeric"
              value={valueExpense}
              onChangeText={(val) => setValueExpense(formatCurrency(val))}
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />

            <TextInput
              placeholder="Anotação"
              value={anotation}
              onChangeText={setAnotation}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={submitting}
              style={{
                backgroundColor: "#22c55e",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 10,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {submitting
                  ? "Salvando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Adicionar Despesa"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#ef4444",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
