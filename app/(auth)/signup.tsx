import { useUser } from '@/hooks/useUser';
import { account, databases } from '@/lib/appwrite';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ID, Permission, Role } from 'react-native-appwrite';


type SchoolLevel = 'primary' | 'secondary' | 'university';

export default function SignUpScreen() {
  const { level } = useLocalSearchParams<{ level: SchoolLevel }>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSignUp = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    // 1. Create account
    const user = await account.create(
      ID.unique(),
      formData.email,
      formData.password,
      formData.fullName
    );

    // 2. Create session
    const session = await account.createEmailPasswordSession(
      formData.email,
      formData.password
    );
    console.log("Appwrite session:", session);

    // 3. Create database profile (linked by userId)
    await databases.createDocument(
      "68ca66480039a017b799", // Database ID
      "user",                 // Collection ID
      user.$id,               // Document ID = Appwrite user ID
      {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        level: level || "primary",
        active: false,
        plan: "free",
        plan_expires: null,
        role: "student", // default role
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id))
      ]
    );

    // 4. Fetch user profile (merge account + db doc)
    let doc;
    try {
      doc = await databases.getDocument("68ca66480039a017b799", "user", user.$id);
    } catch (err) {
      console.warn("Failed to fetch user profile:", err);
    }

    const mappedRole: "admin" | "student" =
      doc?.role === "admin" || doc?.role === "student"
        ? doc.role
        : "student";

    setUser({
      id: user.$id,
      name: user.name ?? "User",
      email: user.email,
      role: mappedRole,
    });

    // 5. Store user token in secure storage
    await SecureStore.setItemAsync('admin_token', user.$id);

    console.log("User signed up and logged in:", user);

    // 6. Redirect (free users -> home, others -> payment)
    setIsLoading(false);
    if (doc?.plan === "free") {
      router.replace("/(tabs)/library");
    } else {
      router.push("/(auth)/payment");
    }
  } catch (err: any) {
    console.error("Sign up error:", err);
    setIsLoading(false);

    if (err.code === 409) {
      setErrors({ email: "Email already in use" });
    } else if (err.code === 422) {
      setErrors({ general: "Invalid input. Check your details." });
    } else if (err.code === 500) {
      setErrors({ general: "Server error. Please try again later." });
    } else {
      setErrors({ general: "An error occurred. Please try again." });
    }
  }
};

  const getLevelName = () => {
    switch (level) {
      case 'primary':
        return 'Primary School';
      case 'secondary':
        return 'Secondary School';
      case 'university':
        return 'University/College';
      default:
        return 'Education';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Selected: {getLevelName()}</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="John Doe"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
            autoCapitalize="words"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="+255 123 456 789"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="••••••••"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="••••••••"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.signUpButton,
            isLoading && styles.signUpButtonDisabled
          ]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 20,
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
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  signUpButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6B7280',
  },
  loginLink: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
});
