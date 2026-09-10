import { styles } from "@/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
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
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);

      await signIn(email, senha);

      router.replace("/(screens)/(home)/home");
    } catch (error: any) {
      if (!error.response) {
        setErrorMessage(
          "Não foi possível conectar ao servidor. Tente novamente."
        );
      } else {
        setErrorMessage(
          error.response.data?.msg || "E-mail ou senha incorretos."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View entering={FadeInLeft.duration(250)} style={styles.container}>
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
              Organize sua vida de forma simples.
            </Text>
          </View>

          {/* =================================================
              CARD
          ================================================= */}

          <View style={styles.formCard}>
            <Text style={styles.title}>Bem-vindo!</Text>

            <Text style={styles.titleDescription}>
              Entre na sua conta para continuar.
            </Text>

            {/* EMAIL */}

            <TextInput
              style={styles.input}
              placeholder="email@email.com"
              placeholderTextColor="#8a8a8a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* SENHA */}

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

            {/* OPÇÕES */}

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

            {/* BOTÃO */}

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

            {/* CADASTRO */}

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
      </View>
    </Animated.View>
  );
}
