import { Stack } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';

export default function AuthLayout() {
  usePreventScreenCapture();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
