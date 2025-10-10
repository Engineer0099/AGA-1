import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function AdminLayout() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.elevation.level2,
          },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
        
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});