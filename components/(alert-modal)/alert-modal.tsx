import { useTheme } from "@/context/ThemeContext";
import { getConfirmModalStyles } from "@/styles/(components)/confirm-modal.styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export default function AlertModal({
  visible,
  title,
  message,
  buttonText = "OK",
  onClose,
}: AlertModalProps) {
  const { colors } = useTheme();
  // Reutiliza o mesmo arquivo de estilos da ConfirmModal
  const styles = getConfirmModalStyles(colors);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Mensagem */}
          <Text style={styles.message}>{message}</Text>

          {/* Botão Único de Ação */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { width: "100%" }]}
              onPress={onClose}
            >
              <Text style={styles.confirmButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
