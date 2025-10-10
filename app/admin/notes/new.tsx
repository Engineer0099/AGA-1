import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type NoteForm = {
  title: string;
  subject: string;
  topic: string;
  author: string;
  pages: string;
  fileType: 'PDF' | 'DOC' | 'PPT';
  description: string;
};

export default function NewNoteScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NoteForm>({
    title: '',
    subject: '',
    topic: '',
    author: '',
    pages: '',
    fileType: 'PDF',
    description: '',
  });

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.topic) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Submitting note:', form);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Note created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Failed to create note. Please try again.');
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
        <Text style={styles.headerTitle}>Add New Note</Text>
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
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            value={form.title}
            onChangeText={(text) => setForm({...form, title: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mathematics"
            value={form.subject}
            onChangeText={(text) => setForm({...form, subject: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Topic *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Differential Calculus"
            value={form.topic}
            onChangeText={(text) => setForm({...form, topic: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Author name"
            value={form.author}
            onChangeText={(text) => setForm({...form, author: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Pages</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={form.pages}
              onChangeText={(text) => setForm({...form, pages: text})}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>File Type</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectText}>{form.fileType}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Add a description..."
            value={form.description}
            onChangeText={(text) => setForm({...form, description: text})}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={24} color="#4A6FA5" />
            <Text style={styles.uploadButtonText}>Upload File</Text>
            <Text style={styles.uploadHint}>PDF, DOC, PPT (Max 10MB)</Text>
          </TouchableOpacity>
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
  uploadSection: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadButton: {
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#4A6FA5',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadHint: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});
