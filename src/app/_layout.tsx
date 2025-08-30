import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "../hooks/useFrameworkReady";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="delivery/[id]" />
        <Stack.Screen name="notification" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="support" />
        <Stack.Screen name="pickupConfirmation" />
        <Stack.Screen name="deliveryProgress" />
        <Stack.Screen name="deliveryComplete" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
