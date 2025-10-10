import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type TabBarIconProps = {
  name: string;
  color: string;
  focused: boolean;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, focused }) => {
  const iconProps = {
    size: 24,
    color: focused ? Colors.light.tint : color,
  };

  const iconContainerStyle: StyleProp<ViewStyle> = [
    styles.tabIconContainer,
    focused && styles.activeTabIconContainer
  ];

  switch (name) {
    case 'library':
      return (
        <View style={iconContainerStyle}>
          <Ionicons name="library-outline" {...iconProps} />
        </View>
      );
    case 'subscription':
      return (
        <View style={iconContainerStyle}>
          <MaterialCommunityIcons name="crown-outline" {...iconProps} />
        </View>
      );
    case 'extras':
      return (
        <View style={iconContainerStyle}>
          <Ionicons name="grid" {...iconProps} />
        </View>
      );
    default:
      return null;
  }
};


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? 90 : 80,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
      initialRouteName="library"
    >
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="library" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="subscription" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="extras"
        options={{
          title: 'Extras',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="extras" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  activeTabIconContainer: {
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
  },
});
