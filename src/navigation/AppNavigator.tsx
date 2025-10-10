import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from 'react-native-paper';

// Import screens
import { useAuth } from '../context/AuthContext';
import AdminScreen from '../screens/admin/AdminScreen';
import ExtrasScreen from '../screens/extras/ExtrasScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Admin: undefined;
};
export type MainTabParamList = {
  Library: undefined;
  Subscription: undefined;
  Extras: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'book';

          if (route.name === 'Library') {
            iconName = 'book';
          } else if (route.name === 'Subscription') {
            iconName = 'account-cash';
          } else if (route.name === 'Extras') {
            iconName = 'dots-horizontal-circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ title: 'Library' }} 
      />
      <Tab.Screen 
        name="Subscription" 
        component={SubscriptionScreen} 
        options={{ title: 'Subscription' }} 
      />
      <Tab.Screen 
        name="Extras" 
        component={ExtrasScreen} 
        options={{ title: 'Extras' }} 
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user?.isAdmin ? (
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
