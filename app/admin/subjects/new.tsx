import { useUser } from '@/hooks/useUser';
import { databases } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ID } from "react-native-appwrite";
import { SafeAreaView } from 'react-native-safe-area-context';


const NewSubjectScreen = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();

    const handleBack = () => {
        router.back();
    };
    const handleSubmit = async () => {
        if (!name.trim() || !grade.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        setIsSubmitting(true);
        setLoading(true);
        try {
            const newSubject = {
                name: name.trim(),
                grade: grade.trim(),
                creater: user?.name || 'unknown',
                no_of_topics: 0
            };
            await databases.createDocument(
                '68ca66480039a017b799',
                'subject',
                ID.unique(),
                newSubject
            );
            Alert.alert('Success', 'Subject created successfully');
            router.push('/admin/subjects');
        } catch (error) {
            console.error('Error creating subject:', error);
            Alert.alert('Error', 'There was an error creating the subject');
        }finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>New Subject</Text>
            </View>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Subject Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter subject name"
                    style={{
                        borderWidth: 1,
                        borderColor: '#D1D5DB',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        color: '#111827',
                        marginBottom: 16,
                        backgroundColor: '#F9FAFB'
                    }}
                />
                <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Grade</Text>
                <Picker
                    selectedValue={grade}
                    onValueChange={(itemValue) => setGrade(itemValue)}
                    style={{
                        borderWidth: 1,
                        borderColor: '#D1D5DB',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 16,
                        color: '#111827',
                        backgroundColor: '#F9FAFB'
                    }}
                    itemStyle={{ fontSize: 16, color: '#111827' }}
                >
                    <Picker.Item label="Select grade" value="" />
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
                </Picker>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: isSubmitting ? '#005bf865' : '#0266f1ff',
                        padding: 16,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 16
                    }}
                    disabled={isSubmitting}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Create Subject</Text>
                    )}
                </TouchableOpacity>
            </View>
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#111827',
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: '#EEF2FF',
  },
  filterText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#4F46E5',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  subjectContent: {
    flex: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  subjectGrade: {
    fontSize: 12,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  subjectExcerpt: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  subjectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  subjectDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A6FA5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});


export default NewSubjectScreen;