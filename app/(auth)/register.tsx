import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
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

export default function RegisterScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 700;
  const { signUp } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !confirmEmail || !senha || !confirmSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Erro", "Os emails informados não coincidem.");
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert("Erro", "As senhas informadas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await signUp({
        name: nome,
        email,
        password: senha,
      });
    } catch (error: any) {
      // Captura a chave 'msg' retornada pelo controller
      const message =
        error.response?.data?.msg ||
        "Não foi possível realizar o cadastro. Verifique os dados.";
      Alert.alert("Erro no Cadastro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, isWide && styles.containerRow]}>
      {/* Painel ilustrativo */}
      <View style={[styles.illustrationPanel, isWide && styles.panelFlex]}>
        <Text style={styles.illustrationTitle}>Organiza-se</Text>
        <View style={styles.iconBadge}>
          <FontAwesome5 name="dollar-sign" size={28} color="#3a6ea5" />
        </View>
      </View>

      {/* Painel do formulário */}
      <View style={[styles.formPanel, isWide && styles.panelFlex]}>
        <View style={styles.formInner}>
          <Text style={styles.title}>Cadastre-se!</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome e sobrenome"
            placeholderTextColor="#8a8a8a"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#8a8a8a"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirme seu email"
            placeholderTextColor="#8a8a8a"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
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

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirme sua senha"
              placeholderTextColor="#8a8a8a"
              value={confirmSenha}
              onChangeText={setConfirmSenha}
              secureTextEntry={!showConfirmSenha}
            />
            <Pressable onPress={() => setShowConfirmSenha(!showConfirmSenha)}>
              <Ionicons
                name={showConfirmSenha ? "eye-off" : "eye"}
                size={20}
                color="#8a8a8a"
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.smallText}>Já tem uma conta? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Faça o login</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
  smallText: { color: "#e5e5e5", fontSize: 13 },
  link: { color: "#4f8ef7", fontSize: 13, fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#2f7cf6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 20,
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
