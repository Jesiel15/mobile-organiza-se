import ConfirmModal from "@/components/(confirm-modal)/confirm-modal";
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
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    // 1. Atualização apenas do Nome
    if (isEditingName) {
      if (!name.trim()) {
        Alert.alert("Erro", "O campo Nome não pode ficar vazio.");
        return;
      }

      try {
        const payload = { name };
        const response = await api.patch("/user/emailname", payload);
        const updatedUser = response.data?.user || payload;

        await updateUser(updatedUser);

        setIsEditingName(false);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } catch (err: any) {
        Alert.alert(
          "Erro",
          err.response?.data?.msg || "Erro ao atualizar dados do perfil."
        );
      }
    }

    // 2. Atualização de Senha
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

    setIsEditingName(false);
    setIsEditingPassword(false);
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

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setIsSignOutModalOpen(true)}
        >
          <Text style={styles.saveButtonText}> Desconectar conta </Text>
        </TouchableOpacity>

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
          {/* Botão invisível reservando o tamanho exato do espaço */}
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
              color={isEditingName ? colors.red : colors.neonGreen}
            />
          </TouchableOpacity>
        </View>

        {/* Input Senha */}
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
              color={isEditingPassword ? colors.red : colors.neonGreen}
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
      {/* Modal de confirmação reutilizável */}
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
