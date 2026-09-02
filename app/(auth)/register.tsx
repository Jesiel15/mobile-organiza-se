import { styles } from "@/styles/register.styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
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

  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!nome || !email || !confirmEmail || !senha || !confirmSenha) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (email.trim() !== confirmEmail.trim()) {
      setErrorMessage("Os e-mails informados não coincidem.");
      return;
    }

    if (senha !== confirmSenha) {
      setErrorMessage("As senhas informadas não coincidem.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);

      // Certifique-se se sua API espera 'name'/'password' OU 'nome'/'senha'
      await signUp({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });
    } catch (error: any) {
      if (!error.response) {
        setErrorMessage(
          "Não foi possível conectar ao servidor. Tente novamente."
        );
        return;
      }

      const backendData = error.response.data;

      // Extrai mensagens no formato string ou array (comum em validações DTO)
      const message =
        backendData?.msg ||
        (Array.isArray(backendData?.message)
          ? backendData.message[0]
          : backendData?.message) ||
        backendData?.error ||
        "Não foi possível realizar o cadastro.";

      setErrorMessage(message);
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
          <Image
            source={require("../../assets/(images)/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
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
            onChangeText={(text) => {
              setNome(text);
              if (errorMessage) setErrorMessage("");
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#8a8a8a"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirme seu email"
            placeholderTextColor="#8a8a8a"
            value={confirmEmail}
            onChangeText={(text) => {
              setConfirmEmail(text);
              if (errorMessage) setErrorMessage("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#8a8a8a"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (errorMessage) setErrorMessage("");
              }}
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
              onChangeText={(text) => {
                setConfirmSenha(text);
                if (errorMessage) setErrorMessage("");
              }}
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

          {/* Exibição inline do erro */}
          {!!errorMessage && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#e0533d" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

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
