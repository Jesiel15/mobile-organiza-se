import { StyleSheet } from "react-native";
import { authColors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authColors.formBackground,
  },

  containerRow: {
    flexDirection: "row",
  },

  panelFlex: {
    flex: 1,
  },

  // =========================================================
  // FORMULÁRIO
  // =========================================================

  formPanel: {
    flex: 1,
    backgroundColor: authColors.formBackground,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  formInner: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  // =========================================================
  // LOGO
  // =========================================================

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  logoImage: {
    width: 85,
    height: 85,
  },

  brandName: {
    color: authColors.text,
    fontSize: 21,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 0.3,
  },

  subtitle: {
    color: authColors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },

  // =========================================================
  // CARD
  // =========================================================

  formCard: {
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 26,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  title: {
    color: authColors.text,
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 6,
  },

  titleDescription: {
    color: "#8f8f8f",
    fontSize: 14,
    marginBottom: 22,
  },

  // =========================================================
  // INPUTS
  // =========================================================

  input: {
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: authColors.text,
    marginBottom: 14,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },

  passwordInput: {
    flex: 1,
    color: authColors.text,
  },

  // =========================================================
  // BOTÃO
  // =========================================================

  primaryButton: {
    backgroundColor: authColors.primary,
    borderRadius: 10,
    minHeight: 50,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 18,

    shadowColor: authColors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  primaryButtonText: {
    color: authColors.primaryText,
    fontWeight: "700",
    fontSize: 15,
  },

  // =========================================================
  // RODAPÉ
  // =========================================================

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  smallText: {
    color: authColors.textMuted,
    fontSize: 13,
  },

  link: {
    color: authColors.link,
    fontSize: 13,
    fontWeight: "600",
  },

  // =========================================================
  // PAINEL ANTIGO
  // =========================================================

  illustrationPanel: {
    display: "none",
  },

  illustrationTitle: {
    display: "none",
  },

  iconBadge: {
    display: "none",
  },

  // =========================================================
  // ERRO
  // =========================================================

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  errorText: {
    color: "#e0533d",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
});
