import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, ActivityIndicator, MD3LightTheme } from 'react-native-paper';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { AppNavigator } from './src/navigation/AppNavigator';

// Theme
import { paperTheme, navigationTheme } from './src/constants/theme';
import { AuthStackParamList } from './src/navigation/types';

// Create stack navigator for auth flow
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Auth stack component
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Root navigator that switches between auth and main app
const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
