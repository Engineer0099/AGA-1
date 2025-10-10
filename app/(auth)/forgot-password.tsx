import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = () => {
    if (validateEmail()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsEmailSent(true);
      }, 1500);
    }
  };

  const handleBackToSignIn = () => {
    router.replace('/(auth)/signin');
  };

  if (isEmailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Check Your Email</Text>
          
          <Text style={styles.message}>
            We&apos;ve sent password reset instructions to {'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <Text style={styles.instruction}>
            Please check your email and follow the instructions to reset your password.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleBackToSignIn}
          >
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive the email? </Text>
            <TouchableOpacity onPress={handleResetPassword} disabled={isLoading}>
              <Text style={styles.resendLink}>
                {isLoading ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Forgot Password</Text>
        
        <Text style={styles.subtitle}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            onBlur={validateEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backToSignIn}
          onPress={handleBackToSignIn}
        >
          <Text style={styles.backToSignInText}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    color: '#1F2937',
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToSignIn: {
    alignItems: 'center',
    marginTop: 8,
  },
  backToSignInText: {
    color: '#4A6FA5',
    fontSize: 16,
    fontWeight: '500',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#4A6FA5',
    fontSize: 14,
    fontWeight: '600',
  },
});
