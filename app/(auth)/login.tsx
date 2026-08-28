import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 700;
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, senha);
      router.replace("/(screens)/(home)/home"); // Altere para a rota da sua tela Home
    } catch (error: any) {
      const message = error.response?.data?.msg || "Email ou senha incorretos.";
      Alert.alert("Falha no Login", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, isWide && styles.containerRow]}>
      {/* Painel do formulário */}
      <View style={[styles.formPanel, isWide && styles.panelFlex]}>
        <View style={styles.formInner}>
          <Text style={styles.title}>Bem-vindo!</Text>

          <TextInput
            style={styles.input}
            placeholder="email@email.com"
            placeholderTextColor="#8a8a8a"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
              placeholderTextColor="#8a8a8a"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showSenha}
            />
            <Pressable onPress={() => setShowSenha(!showSenha)}>
              <Ionicons
                name={showSenha ? "eye-off" : "eye"}
                size={20}
                color="#8a8a8a"
              />
            </Pressable>
          </View>

          <View style={styles.rowBetween}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setLembrar(!lembrar)}
            >
              <View
                style={[styles.checkbox, lembrar && styles.checkboxChecked]}
              />
              <Text style={styles.smallText}>Lembre-me</Text>
            </Pressable>

            <TouchableOpacity>
              <Text style={styles.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.smallText}>Não tem uma conta? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Painel ilustrativo */}
      <View style={[styles.illustrationPanel, isWide && styles.panelFlex]}>
        <Text style={styles.illustrationTitle}>Organiza-se</Text>
        <View style={styles.iconBadge}>
          <FontAwesome5 name="dollar-sign" size={28} color="#3a6ea5" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerRow: { flexDirection: "row" },
  panelFlex: { flex: 1 },
  formPanel: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formInner: { width: "100%", maxWidth: 340, alignSelf: "center" },
  title: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 14,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  passwordInput: { flex: 1, color: "#fff" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#3a6ea5",
    borderRadius: 3,
    marginRight: 8,
  },
  checkboxChecked: { backgroundColor: "#3a6ea5" },
  smallText: { color: "#e5e5e5", fontSize: 13 },
  link: { color: "#4f8ef7", fontSize: 13, fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#2f7cf6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700" },
  footerRow: { flexDirection: "row", justifyContent: "center" },
  illustrationPanel: {
    backgroundColor: "#b9d3ea",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  illustrationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  iconBadge: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#3a6ea5",
    alignItems: "center",
    justifyContent: "center",
  },
});
