import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Paper Theme
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A6FA5',
    accent: '#4A6FA5',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    error: '#DC3545',
    text: '#212529',
    onSurface: '#1A1C1E',
    disabled: '#6C757D',
    placeholder: '#6C757D',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 4,
  animation: {
    scale: 1.0,
  },
};

// Navigation Theme
export const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: '#4A6FA5',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#212529',
    border: '#E9ECEF',
    notification: '#FFC107',
  },
};

// Combined theme (for backward compatibility)
export const theme = {
  ...paperTheme,
  roundness: 4,
  animation: {
    scale: 1.0,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6C757D',
  },
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  full: 9999,
};
