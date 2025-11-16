import { useUser } from '@/hooks/useUser';
import { account } from '@/lib/appwrite';
import { fetchDocumentById } from '@/utils/util';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const {setUser} = useUser()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Phone Number is required';
    } else if (formData.phone.length  !== 13) {
      newErrors.phone = 'Please enter a valid Phone Number i.e, (0612345678)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignIn = async () => {
    if (formData.phone.startsWith('0') && formData.phone.length === 10) {
      formData.phone = formData.phone.substring(1);
    }
    if (!formData.phone.startsWith('+255')) {
      formData.phone = '+255' + formData.phone;
    }
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create an Appwrite email session and fetch the logged-in user
        const fakeEmail = `${formData.phone}@aga.com`;
        await account.createEmailPasswordSession(fakeEmail, formData.password);
        
        const user = await account.get()

        let doc;
        try {
          doc = await fetchDocumentById("68ca66480039a017b799", "user", user.$id);
        } catch (err) {
          console.warn("Failed to fetch user profile:", err);
        }

        const mappedRole: "admin" | "student" =
          doc?.role === "admin" || doc?.role === "teacher" || doc?.role === "student"
            ? doc.role
            : "student";

        setUser({
          id: doc.$id,
          name: doc.name ?? "User",
          email: doc.email,
          role: mappedRole,
          phone: doc.phone ?? '',
          bio: doc.bio ?? '',
          plan: doc.plan ?? 'free',
        });

        
        // Check email to determine user role
        const isAdmin = mappedRole === "admin";
        
        if (isAdmin) {
          // For admin users, store token and navigate to admin dashboard
          await SecureStore.setItemAsync('admin_token', user.$id);
        } else {
          // For regular users, navigate to the main app tabs
          await SecureStore.setItemAsync('user_token', user.$id);
        }
        router.replace('/(tabs)/library');
      } catch (error) {
        console.error('Sign in error:', error);
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to your account</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="your phone number (e.g., 0612345678)"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text.trim())}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="••••••••"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text.trim())}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        
        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don&#39;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/onboarding')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,

  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4A6FA5',
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
  signInButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#6B7280',
  },
  signUpLink: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
});
