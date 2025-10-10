import { useUser } from '@/hooks/useUser';
import { account, databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { saveUserLocally } from '../(auth)/splash';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser } = useUser();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create an Appwrite email session and fetch the logged-in user
        const session = await account.createEmailPasswordSession(email, password);
        console.log('Appwrite session:', session);

        let user = await account.get()

        let doc;
        try {
          doc = await databases.getDocument("68ca66480039a017b799", "user", user.$id);
        } catch (err) {
          console.warn("Failed to fetch user profile:", err);
        }

        const mappedRole: "admin" | "teacher" | "student" =
          doc?.role === "admin" || doc?.role === "teacher" || doc?.role === "student"
            ? doc.role
            : "student";

        const localUser = {
          id: user.$id,
          name: user.name ?? "User",
          email: user.email,
          role: mappedRole,
        };
        await saveUserLocally(localUser);
        setUser(localUser);

        // Check email to determine user role
        const isAdmin = mappedRole === "admin";
        
        if (isAdmin) {
          // For admin users, store token and navigate to admin dashboard
          await SecureStore.setItemAsync('admin_token', localUser.id);
          router.replace('/admin');
        } else if (mappedRole === "teacher" || mappedRole === "student") {
          // For regular users, navigate to the main app tabs
          await SecureStore.setItemAsync('user_token', localUser.id);
          router.replace('/(tabs)/library');
        }
        
      } catch (error) {
        console.error('Sign in error:', error);
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Admin Login</Text>
        
        <View style={[styles.inputContainer, errors.email && styles.inputError]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9ca3af"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={[styles.inputContainer, errors.password && styles.inputError]}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.buttonText}>Signing in...</Text>
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
    inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});
