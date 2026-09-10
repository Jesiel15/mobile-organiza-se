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
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
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

  const validatePassword = (pass: string) => {
    const letters = pass.match(/[a-zA-Z]/g) || [];
    const numbers = pass.match(/[0-9]/g) || [];

    return letters.length >= 4 && numbers.length >= 2;
  };

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

    if (!validatePassword(senha)) {
      setErrorMessage("A senha deve ter no mínimo 4 letras e 2 números.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);

      await signUp({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });
    } catch (error: any) {
      const backendData = error.response?.data;

      const message =
        backendData?.msg || "Não foi possível realizar o cadastro.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(250)}
      style={styles.container}
    >
      <View style={styles.formPanel}>
        <View style={styles.formInner}>
          {/* =================================================
              LOGO
          ================================================= */}

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/(images)/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.brandName}>Organiza-se</Text>

            <Text style={styles.subtitle}>
              Crie sua conta e comece a se organizar.
            </Text>
          </View>

          {/* =================================================
              CARD
          ================================================= */}

          <View style={styles.formCard}>
            <Text style={styles.title}>Criar conta</Text>

            <Text style={styles.titleDescription}>
              Preencha seus dados para começar.
            </Text>

            {/* NOME */}

            <TextInput
              style={styles.input}
              placeholder="Digite seu nome e sobrenome"
              placeholderTextColor="#8a8a8a"
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                clearError();
              }}
            />

            {/* EMAIL */}

            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#8a8a8a"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError();
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* CONFIRMAÇÃO EMAIL */}

            <TextInput
              style={styles.input}
              placeholder="Confirme seu email"
              placeholderTextColor="#8a8a8a"
              value={confirmEmail}
              onChangeText={(text) => {
                setConfirmEmail(text);
                clearError();
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* SENHA */}

            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha"
                placeholderTextColor="#8a8a8a"
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  clearError();
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

            {/* CONFIRMAÇÃO SENHA */}

            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirme sua senha"
                placeholderTextColor="#8a8a8a"
                value={confirmSenha}
                onChangeText={(text) => {
                  setConfirmSenha(text);
                  clearError();
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

            {/* ERRO */}

            {!!errorMessage && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#e0533d"
                />

                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* BOTÃO */}

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

            {/* LOGIN */}

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
    </Animated.View>
  );
}
