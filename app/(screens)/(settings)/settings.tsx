import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getSettingsStyles } from "@/styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const { colors, theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const styles = getSettingsStyles(colors, isMobile);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (isEditingName || isEditingEmail) {
      if (isEditingName && !name.trim()) {
        Alert.alert("Erro", "O campo Nome não pode ficar vazio.");
        return;
      }
      if (isEditingEmail && !email.trim()) {
        Alert.alert("Erro", "O campo Email não pode ficar vazio.");
        return;
      }

      const payload: Record<string, string> = {};
      if (isEditingName) payload.name = name;
      if (isEditingEmail) payload.email = email;

      try {
        const response = await api.patch("/user/emailname", payload);
        const updatedUser = response.data?.user || payload;

        await updateUser(updatedUser);

        setIsEditingName(false);
        setIsEditingEmail(false);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } catch (err: any) {
        Alert.alert(
          "Erro",
          err.response?.data?.msg || "Erro ao atualizar dados do perfil."
        );
      }
    }

    if (isEditingPassword) {
      if (!password || !newPassword || !confirmPassword) {
        Alert.alert("Erro", "Preencha todos os campos de senha.");
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
        return;
      }

      try {
        await api.patch("/user/password", {
          oldPassword: password,
          newPassword,
        });

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditingPassword(false);

        Alert.alert("Sucesso", "Senha alterada com sucesso!");
      } catch (err: any) {
        Alert.alert(
          "Erro",
          err.response?.data?.msg || "Erro ao alterar a senha."
        );
      }
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPassword(false);
  };

  const isAnyFieldEditing =
    isEditingName || isEditingEmail || isEditingPassword;

  return (
    <View style={styles.container}>
      {/* 1. Sidebar inserido na raiz do layout */}
      <Sidebar activeScreen="Configurações" />

      {/* 2. Conteúdo da tela */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          Gerencie suas preferências de conta e aplicativo
        </Text>

        <Text style={styles.sectionTitle}>Aparência</Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "light" && styles.themeOptionActive,
            ]}
            onPress={() => setTheme("light")}
          >
            <Ionicons
              name="sunny-outline"
              size={20}
              color={theme === "light" ? colors.primary : colors.textColor}
            />
            <Text
              style={[
                styles.themeOptionText,
                theme === "light" && styles.themeOptionTextActive,
              ]}
            >
              Claro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "dark" && styles.themeOptionActive,
            ]}
            onPress={() => setTheme("dark")}
          >
            <Ionicons
              name="moon-outline"
              size={20}
              color={theme === "dark" ? colors.primary : colors.textColor}
            />
            <Text
              style={[
                styles.themeOptionText,
                theme === "dark" && styles.themeOptionTextActive,
              ]}
            >
              Escuro
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, !isEditingName && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={isEditingName}
            pointerEvents={isEditingName ? "auto" : "none"}
            placeholder="Nome do usuário"
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setIsEditingName(!isEditingName)}
          >
            <Ionicons
              name={isEditingName ? "close" : "pencil"}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, !isEditingEmail && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            editable={isEditingEmail}
            pointerEvents={isEditingEmail ? "auto" : "none"}
            placeholder="E-mail do usuário"
            placeholderTextColor={colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setIsEditingEmail(!isEditingEmail)}
          >
            <Ionicons
              name={isEditingEmail ? "close" : "pencil"}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, !isEditingPassword && styles.inputDisabled]}
            value={password}
            onChangeText={setPassword}
            editable={isEditingPassword}
            pointerEvents={isEditingPassword ? "auto" : "none"}
            placeholder="Senha atual"
            placeholderTextColor={colors.gray}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => setIsEditingPassword(!isEditingPassword)}
          >
            <Ionicons
              name={isEditingPassword ? "close" : "pencil"}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {isEditingPassword && (
          <>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nova senha do usuário"
                placeholderTextColor={colors.gray}
                secureTextEntry
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmar senha do usuário"
                placeholderTextColor={colors.gray}
                secureTextEntry
              />
            </View>
          </>
        )}

        {isAnyFieldEditing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
