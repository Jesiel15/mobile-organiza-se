// app/(screens)/_layout.tsx
import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(home)/home" />
      <Stack.Screen name="(charts)/charts" />
      <Stack.Screen name="(calendar)/calendar" />
      <Stack.Screen name="(settings)/settings" />
      <Stack.Screen name="(support)/support" />
      <Stack.Screen name="(expense-form)/expense-form" />
      <Stack.Screen name="(revenue-form)/revenue-form" />
    </Stack>
  );
}
