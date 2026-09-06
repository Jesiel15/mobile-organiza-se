import ConfirmModal from "@/components/(confirm-modal)/confirm-modal";
import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getSettingsStyles } from "@/styles/settings.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const { user, updateUser, signOut } = useAuth();
  const styles = getSettingsStyles(colors, isMobile);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Estados de feedback inline e loading
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validatePassword = (pass: string) => {
    const letters = pass.match(/[a-zA-Z]/g) || [];
    const numbers = pass.match(/[0-9]/g) || [];

    return letters.length >= 4 && numbers.length >= 2;
  };

  const handleSave = async () => {
    clearMessages();

    // 1. Atualização apenas do Nome
    if (isEditingName) {
      if (!name.trim()) {
        setErrorMessage("O campo Nome não pode ficar vazio.");
        return;
      }

      try {
        setLoading(true);
        const payload = { name };
        const response = await api.patch("/user/emailname", payload);
        const updatedUser = response.data?.user || payload;

        await updateUser(updatedUser);

        setIsEditingName(false);
        setSuccessMessage("Perfil atualizado com sucesso!");
      } catch (err: any) {
        setErrorMessage(
          err.response?.data?.msg || "Erro ao atualizar dados do perfil."
        );
      } finally {
        setLoading(false);
      }
    }

    // 2. Atualização de Senha
    if (isEditingPassword) {
      if (!password || !newPassword || !confirmPassword) {
        setErrorMessage("Preencha todos os campos de senha.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("A nova senha e a confirmação não coincidem.");
        return;
      }

      if (!validatePassword(newPassword)) {
        setErrorMessage("A senha deve ter no mínimo 4 letras e 2 números.");
        return;
      }

      try {
        setLoading(true);
        await api.put("/user/password", {
          password: password,
          newPassword,
        });

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditingPassword(false);

        setSuccessMessage("Senha alterada com sucesso!");
      } catch (err: any) {
        setErrorMessage(err.response?.data?.msg || "Erro ao alterar a senha.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    signOut();
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setIsEditingName(false);
    setIsEditingPassword(false);
    clearMessages();
  };

  const isAnyFieldEditing = isEditingName || isEditingPassword;

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Configurações" />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>⚙ Configurações</Text>
        <Text style={styles.subtitle}>
          Gerencie suas preferências de conta e aplicativo
        </Text>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setIsSignOutModalOpen(true)}
          >
            <Text style={styles.saveButtonText}>Desconectar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => router.push("/support")}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.supportButtonText}>Suporte</Text>
          </TouchableOpacity>
        </View>

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

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "blue" && styles.themeOptionActiveBlue,
            ]}
            onPress={() => setTheme("blue")}
          >
            <Ionicons
              name="moon-outline"
              size={20}
              color={theme === "blue" ? colors.primary : colors.textColor}
            />
            <Text
              style={[
                theme === "blue"
                  ? styles.themeOptionTextBlue
                  : styles.themeOptionText,
                theme === "blue" && styles.themeOptionTextActive,
              ]}
            >
              Azul
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dados Pessoais</Text>

        {/* Input E-mail (Apenas Leitura / Desabilitado) */}
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
            pointerEvents="none"
            placeholder="E-mail do usuário"
            placeholderTextColor={colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View
            style={[styles.editIconButton, { opacity: 0 }]}
            pointerEvents="none"
          >
            <Ionicons name="pencil" size={20} color="transparent" />
          </View>
        </View>

        {/* Input Nome (Editável) */}
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, !isEditingName && styles.inputDisabled]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errorMessage || successMessage) clearMessages();
            }}
            editable={isEditingName}
            pointerEvents={isEditingName ? "auto" : "none"}
            placeholder="Nome do usuário"
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => {
              setIsEditingName(!isEditingName);
              clearMessages();
            }}
          >
            <Ionicons
              name={isEditingName ? "close" : "pencil"}
              size={20}
              color={isEditingName ? colors.red : colors.neonGreen}
            />
          </TouchableOpacity>
        </View>

        {/* Input Senha Atual */}
        <View style={styles.inputGroup}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[
                styles.input,
                !isEditingPassword && styles.inputDisabled,
                { flex: 1 },
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage || successMessage) clearMessages();
              }}
              editable={isEditingPassword}
              pointerEvents={isEditingPassword ? "auto" : "none"}
              placeholder="Senha atual"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPassword}
            />
            {isEditingPassword && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.editIconButton}
            onPress={() => {
              setIsEditingPassword(!isEditingPassword);
              clearMessages();
            }}
          >
            <Ionicons
              name={isEditingPassword ? "close" : "pencil"}
              size={20}
              color={isEditingPassword ? colors.red : colors.neonGreen}
            />
          </TouchableOpacity>
        </View>

        {isEditingPassword && (
          <>
            {/* Input Nova Senha */}
            <View style={styles.inputGroup}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errorMessage || successMessage) clearMessages();
                  }}
                  placeholder="Nova senha do usuário"
                  placeholderTextColor={colors.gray}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: "absolute", right: 12 }}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Confirmar Senha */}
            <View style={styles.inputGroup}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errorMessage || successMessage) clearMessages();
                  }}
                  placeholder="Confirmar senha do usuário"
                  placeholderTextColor={colors.gray}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: "absolute", right: 12 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Exibição inline de Mensagem de Erro */}
        {!!errorMessage && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color="#e0533d"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "#e0533d", fontSize: 14 }}>
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Exibição inline de Mensagem de Sucesso */}
        {!!successMessage && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#4EBA6F"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "#4EBA6F", fontSize: 14 }}>
              {successMessage}
            </Text>
          </View>
        )}

        {isAnyFieldEditing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={isSignOutModalOpen}
        title="Desconectar conta"
        message="Tem certeza que deseja sair?"
        cancelText="Cancelar"
        confirmText="Sair"
        onCancel={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </View>
  );
}
