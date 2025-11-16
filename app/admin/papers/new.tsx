import { useUser } from '@/hooks/useUser';
import { createDocument, fetchDocumentsWithQuery } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ID, Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../../lib/appwrite';

type PaperForm = {
  title: string;
  subject: string;
  year: string;
  grade: string;
  type: 'Midterm' | 'Final' | 'Quiz' | 'Practice';
  fileType: 'PDF' | 'DOC' | 'IMAGE';
  description: string;
};

export default function NewPaperScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [form, setForm] = useState<PaperForm>({
    title: '',
    subject: '',
    year: new Date().getFullYear().toString(),
    type: 'Midterm',
    grade: '',
    fileType: 'PDF',
    description: '',
  });
  const [file, setFile] = useState<any>(null);
  const handleInputChange = (field: string, value: string) => { 
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    router.back();
  };

  // Pick file
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    console.log(res);
    if (res) {
      setFile({
        uri: res.assets ? res.assets[0].uri : '',
        name: res.assets ? res.assets[0].name : '',
        size: res.assets ? res.assets[0].size : 0,
        mimeType: res.assets ? res.assets[0].mimeType : '',
      });
      console.log('Selected file:', res);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.year || !file) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Convert picked file URI -> Blob
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // 2. Wrap blob in File object (Appwrite understands this)
      const appwriteFile = {
        name: file.name,
        size: blob.size,
        type: file.mimeType,
        uri: file.uri,
      };

      // 3. Upload to Appwrite storage
      const fileData = await storage.createFile(
        '68d2174c0000e21e68f0',
        ID.unique(),
        appwriteFile
      );
      console.log('File uploaded:', fileData);

      // 4. Save metadata in database
      const paperData = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        year: form.year.trim() as string,
        type: form.type.trim(),
        creater: user?.name.trim(),
        grade: form.grade.trim(),
        fileType: form.fileType.trim(),
        description: form.description.trim(),
        fileId: fileData.$id.trim(),
      };

      await createDocument(
        '68ca66480039a017b799',
        'past_paper',
        paperData
      );

      Alert.alert('Success', 'Paper created successfully');
      router.replace('/admin/papers');
    } catch (error) {
      console.error('Error creating paper:', error);
      Alert.alert('Error', 'Failed to create paper. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect( () => {
    form.subject = '';
    const fetchSubjects = async () => {
      try {
        const response = await fetchDocumentsWithQuery(
          '68ca66480039a017b799',
          'subject',
          [
            Query.equal('grade', form.grade)
          ]
        );
        setSubjects(response.map(doc => doc.name) as any);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
      
    };

    if (form.grade) {
      fetchSubjects();
    }
  }, [form.grade]);
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Paper</Text>
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
            placeholder="Enter paper title"
            value={form.title}
            onChangeText={(text) => setForm({...form, title: text})}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <Text style={styles.label}>Grade *</Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={form.grade}
            onValueChange={(itemValue: string) => handleInputChange('grade', itemValue)}
            style={styles.picker}
            dropdownIconColor="#6B7280"
          >
            <Picker.Item label='Pre School' value="pre-school" />
            <Picker.Item label="Standard 1" value="standard_1" />
            <Picker.Item label="Standard 2" value="standard_2" />
            <Picker.Item label="Standard 3" value="standard_3" />
            <Picker.Item label="Standard 4" value="standard_4" />
            <Picker.Item label="Standard 5" value="standard_5" />
            <Picker.Item label="Standard 6" value="standard_6" />
            <Picker.Item label="Standard 7" value="standard_7" />
            <Picker.Item label="Form 1" value="form-1" />
            <Picker.Item label="Form 2" value="form-2" />
            <Picker.Item label="Form 3" value="form-3" />
            <Picker.Item label="Form 4" value="form-4" />
            <Picker.Item label="Form 5" value="form-5" />
            <Picker.Item label="Form 6" value="form-6" />
            <Picker.Item label='Short Course' value="short-course" />
            <Picker.Item label='College' value="college" />
            <Picker.Item label="University" value="university" />
            <Picker.Item label="Ujasiliamali" value="ujasiliamali" />                
          </Picker>
        </View>
        

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject *</Text>
          {form.grade === '' ? (
            <View style={styles.input}>
              <ActivityIndicator size='small' color='blue' />
            </View>
          ) : (
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={form.subject}
                onValueChange={(itemValue: string) => handleInputChange('subject', itemValue)}
                style={styles.picker}
                dropdownIconColor="#6B7280"
              >
                <Picker.Item label="Select a subject" value="" />
                {subjects.map((subject: string) => (
                  <Picker.Item key={subject} label={subject} value={subject} />
                ))}
              </Picker>
            </View>
          )}
        </View>
        

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Year *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2023"
              value={form.year}
              onChangeText={(text) => setForm({...form, year: text})}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={form.type}
                onValueChange={(itemValue: string) => handleInputChange('type', itemValue)}
                style={styles.picker}
                dropdownIconColor="#6B7280"
              >
                <Picker.Item label="Midterm" value="Midterm" />
                <Picker.Item label="Final" value="Final" />
                <Picker.Item label="Quiz" value="Quiz" />
                <Picker.Item label="Practice" value="Practice" />
              </Picker>
            </View>
          </View>

        </View>


        <View style={styles.formGroup}>
          <Text style={styles.label}>File Type</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={form.fileType}
              onValueChange={(itemValue: string) => handleInputChange('fileType', itemValue)}
              style={styles.picker}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="PDF" value="PDF" />
              <Picker.Item label="DOC" value="DOC" />
              <Picker.Item label="IMAGE" value="IMAGE" />
            </Picker>
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
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickFile}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#4A6FA5" />
            <Text style={styles.uploadButtonText}>Upload File</Text>
            <Text style={styles.uploadHint}>PDF, DOC, IMAGE (Max 10MB)</Text>
            {file?.name ? <Text style={styles.uploadHint}>{file.name}</Text> : null}
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
  picker: {
    width: '100%',
    height: 48,
    color: '#111827',
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
