import { styles } from "@/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";

const REMEMBER_EMAIL_KEY = "remembered_email";

const getSavedItem = async (key: string) => {
  if (Platform.OS === "web") {
    return await AsyncStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const setSavedItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteSavedItem = async (key: string) => {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // Carrega o e-mail salvo com segurança ao iniciar a tela
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const savedEmail = await getSavedItem(REMEMBER_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          setLembrar(true);
        }
      } catch (error) {
        console.error("Erro ao carregar e-mail salvo:", error);
      }
    };

    loadRememberedEmail();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);

      // Trata a persistência segura do "Lembre-me"
      if (lembrar) {
        await setSavedItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        await deleteSavedItem(REMEMBER_EMAIL_KEY);
      }

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formPanel}>
            <View style={styles.formInner}>
              {/* LOGO */}
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

              {/* CARD */}
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
                      style={[
                        styles.checkbox,
                        lembrar && styles.checkboxChecked,
                      ]}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
