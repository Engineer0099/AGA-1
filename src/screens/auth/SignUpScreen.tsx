import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  SchoolLevel: { email: string; password: string };
  Subscription: { schoolLevel: string };
  MainApp: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

type SchoolLevel = 'primary' | 'secondary' | 'university';

export const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('secondary');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loading, error } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    await register(email, password, schoolLevel);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: theme.colors.primary }]}>
              AGA
            </Text>
            <Text style={styles.tagline}>Create Your Account</Text>
          </View>

          <View style={styles.formContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Get Started
            </Text>
            <Text style={styles.subtitle}>
              Create an account to access all features
            </Text>

            {error && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              disabled={loading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              disabled={loading}
              right={
                <TextInput.Icon 
                  icon={showPassword ? 'eye-off' : 'eye'} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              disabled={loading}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? 'eye-off' : 'eye'} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <View style={styles.radioGroup}>
              <Text style={styles.radioLabel}>School Level</Text>
              <RadioButton.Group 
                onValueChange={value => setSchoolLevel(value as SchoolLevel)} 
                value={schoolLevel}
              >
                <View style={styles.radioOption}>
                  <RadioButton.Android value="primary" color={theme.colors.primary} />
                  <Text>Primary School</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="secondary" color={theme.colors.primary} />
                  <Text>Secondary School</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="university" color={theme.colors.primary} />
                  <Text>University</Text>
                </View>
              </RadioButton.Group>
            </View>

            <Button
              mode="contained"
              onPress={handleSignUp}
              style={styles.button}
              loading={loading}
              disabled={loading || !email || !password || password !== confirmPassword}
            >
              Create Account
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Text
                style={[styles.link, { color: theme.colors.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
  },
  link: {
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default SignUpScreen;
