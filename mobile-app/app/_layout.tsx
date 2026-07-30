import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="alert" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="camera" options={{ title: 'Camera verification' }} />
        <Stack.Screen name="setup" options={{ title: 'Connect Home Assistant' }} />
      </Stack>
    </>
  );
}
