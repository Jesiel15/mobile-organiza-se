import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

function InitialLayout() {
  const { token, isLoading } = useAuth();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2f7cf6" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
