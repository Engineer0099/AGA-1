import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ID } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';


const NewTipScreen = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'study' as 'study' | 'motivation' | 'exam'| 'other',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => { 
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newTip = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
      };
      if (formData.status === 'published') {
        await databases.createDocument(
          '68ca66480039a017b799',
          'study_tip', 
          ID.unique(),
          newTip
        );
      } else {
        await databases.createDocument(
          '68ca66480039a017b799',
          'draft_tip',
          ID.unique(),
          newTip
        );
      }
      Alert.alert('Success', 'Tip created successfully!', [
        { 
          text: 'OK', 
          onPress: () => router.replace('/admin/tips') 
        }
      ]);
    } catch (error) {
      console.error('Error creating tip:', error);
      Alert.alert('Error', 'Failed to create tip. Please try again.');
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
        <Text style={styles.headerTitle}>New Tip</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tip title"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter tip content (supports markdown)"
              value={formData.content}
              onChangeText={(text) => handleInputChange('content', text)}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(itemValue: string) => handleInputChange('category', itemValue)}
                style={styles.picker}
                dropdownIconColor="#6B7280"
              >
                <Picker.Item label="Study" value="study" />
                <Picker.Item label="Motivation" value="motivation" />
                <Picker.Item label="Exam" value="exam" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'draft' && styles.statusButtonActive,
                  { borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }
                ]}
                onPress={() => handleInputChange('status', 'draft')}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.status === 'draft' && styles.statusButtonTextActive
                ]}>
                  Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  formData.status === 'published' && styles.statusButtonActive,
                  { borderTopRightRadius: 6, borderBottomRightRadius: 6 }
                ]}
                onPress={() => handleInputChange('status', 'published')}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.status === 'published' && styles.statusButtonTextActive
                ]}>
                  Publish
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 48,
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  statusButtonActive: {
    backgroundColor: '#4F46E5',
  },
  statusButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default NewTipScreen;
