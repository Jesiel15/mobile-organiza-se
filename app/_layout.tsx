import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

function InitialLayout() {
  const { token, isLoading } = useAuth();
  const { colors, isThemeLoading } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const noSegments = !segments[0];

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && (inAuthGroup || noSegments)) {
      router.replace("/(screens)/(home)/home");
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.backgroundHome,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isLoading || isThemeLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.backgroundHome,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return <Slot />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
