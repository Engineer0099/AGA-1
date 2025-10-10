import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type UserForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'suspended';
};

export default function NewUserScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    status: 'active',
  });

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Submitting user:', form);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'User created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New User</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={form.name}
            onChangeText={(text) => setForm({...form, name: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={form.email}
            onChangeText={(text) => setForm({...form, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={form.password}
            onChangeText={(text) => setForm({...form, password: text})}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChangeText={(text) => setForm({...form, confirmPassword: text})}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>
                {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>
                {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
});
