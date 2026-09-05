import { ThemeColors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const getSupportStyles = (colors: ThemeColors, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isMobile ? "column" : "row",
      backgroundColor: colors.backgroundHome,
    },
    scrollContent: {
      flexGrow: 1,
      paddingLeft: isMobile ? 12 : 44,
      paddingRight: isMobile ? 12 : 44,
      paddingBottom: isMobile ? 90 : 44,
      paddingTop: isMobile ? 64 : 20,
    },

    // ---------- Cabeçalho da Tela ----------
    greeting: {
      fontSize: 16,
      color: colors.textColor,
      marginBottom: 2,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textColor,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray,
      marginBottom: 16,
    },

    // ---------- Seções e Cards (Mesmo padrão do cardSection) ----------
    sectionTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: colors?.textColor || "#101828",
      marginBottom: 12,
    },
    cardSection: {
      borderRadius: 12,
      padding: isMobile ? 14 : 32,
      borderColor: colors?.surfaceBorder || "#EAECF0",
      backgroundColor: colors?.surface || "#FFFFFF",
      maxWidth: 900,
      marginBottom: 24,
      boxShadow: [
        {
          offsetX: 2,
          offsetY: 4,
          blurRadius: 4,
          spreadDistance: 0,
          color: "rgba(0, 0, 0, 0.1)",
        },
      ],
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.textColor,
      marginBottom: 16,
    },
    cooldownText: {
      color: colors.yellow,
      marginBottom: 12,
      fontSize: 14,
      fontWeight: "500",
    },

    // ---------- Entradas de Texto ----------
    input: {
      height: 48,
      backgroundColor: colors.modalColor,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 15,
      color: colors.textColor,
      marginBottom: 16,
      outlineStyle: "none" as any,
    },
    textArea: {
      height: 120,
      paddingTop: 12,
      paddingBottom: 12,
      textAlignVertical: "top",
    },

    // ---------- Botões de Ação ----------
    button: {
      height: 46,
      backgroundColor: colors.neonGreen,
      borderRadius: 8,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: isMobile ? "stretch" : "flex-start",
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 15,
    },

    // ---------- Cards de Chamados (Linhas / Items) ----------
    ticketCard: {
      borderRadius: 12,
      padding: isMobile ? 14 : 24,
      backgroundColor: colors.surface,
      borderColor: colors.surfaceBorder,
      borderWidth: 1,
      marginBottom: 16,
      maxWidth: 900,
      boxShadow: [
        {
          offsetX: 2,
          offsetY: 4,
          blurRadius: 4,
          spreadDistance: 0,
          color: "rgba(0, 0, 0, 0.1)",
        },
      ],
    },
    ticketHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    ticketSubject: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: "600",
      color: colors.textColor,
      flexShrink: 1,
    },
    statusBadge: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#FFFFFF",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: "hidden",
    },
    userEmailText: {
      fontSize: 13,
      color: colors.gray,
      marginBottom: 12,
    },

    // ---------- Mensagens e Respostas ----------
    messagesContainer: {
      marginVertical: 12,
      gap: 8,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 8,
      maxWidth: "85%",
    },
    adminMessageBubble: {
      backgroundColor: colors.skyBlueSuave,
      alignSelf: "flex-start",
    },
    userMessageBubble: {
      backgroundColor: colors.modalColor,
      borderColor: colors.lineColor,
      borderWidth: 1,
      alignSelf: "flex-end",
    },
    messageSender: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.gray,
      marginBottom: 4,
    },
    messageText: {
      fontSize: 14,
      color: colors.textColor,
    },
    replyContainer: {
      flexDirection: isMobile ? "column" : "row",
      marginTop: 16,
      gap: 12,
    },
    replyInput: {
      flex: 1,
      marginBottom: 0,
    },
    replyButton: {
      width: isMobile ? "100%" : 120,
    },
    actionsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 16,
    },
  });

export default getSupportStyles;
