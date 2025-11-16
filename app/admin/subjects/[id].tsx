import { useUser } from '@/hooks/useUser';
import { createDocument, fetchAllDocuments, fetchDocumentById, isOnline } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




const SubjectDetailsScreen = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useUser();
    const [subject, setSubject] = useState(null as any);
    const [fetching, setFetching] = useState(false);
    const [topic, setTopic] = useState({})
    const [paper, setPaper ] = useState({});
    const [selectedTab, setSelectedTab] = useState<'topic' | 'paper'>('topic');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null as string | null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTopicData, setNewTopicData] = useState({ title: '', description: '', subject: '', creater: '' , no_of_lessons: 0});


    // Reusable InfoRow component
    const InfoRow = ({ 
      label, 
      value, 
      icon,
      valueStyle = {}
    }: { 
      label: string; 
      value: string;  
      icon: keyof typeof Ionicons.glyphMap;
      valueStyle?: object;
    }) => (
      <View style={styles.infoRow}>
        <View style={styles.infoLabel}>
          <Ionicons name={icon} size={18} color="#6B7280" style={styles.infoIcon} />
          <Text style={styles.infoLabelText}>{label}</Text>
        </View>
        <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
      </View>
    );

    // handle add topic
    const handleAddTopic = () => {
        setIsVisible(true);
    };

    //Handle Submit New Topic
    const handleSubmitNewTopic = async () => {
        setIsSubmitting(true);
        const topicData = {
            ...newTopicData,
            subject: subject.name,
            creater: user?.name,
        };
        try {
            await createDocument(
              '68ca66480039a017b799',
              'topic',
              topicData
            );
            setIsVisible(false);
            setNewTopicData({ title: '', description: '', subject: '', creater: '', no_of_lessons: 0 });
        } catch (err) {
            console.error('Error adding topic:', err);
            alert('Failed to add topic. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };


    
    

    useEffect(() => {
        const fetchSubject = async () => {
            const subjectId = Array.isArray(id) ? id[0] : id;
            if (!subjectId) {
                setError('Invalid subject ID');
                setLoading(false);
                return;
            }
            if (!await isOnline()) {
                setError('No internet connection. Please check your connection and try again.');
                setLoading(false);
                return;
            }
            try {
                const response = await fetchDocumentById('68ca66480039a017b799', 'subject', subjectId);
                setSubject(response);
            } catch (err) {
                console.error('Error fetching subject:', err);
                setError('Failed to load subject details. Please try again later.');
            }
            setLoading(false);
        };

    fetchSubject();
    }, [id]);


    useEffect(() => {
      //Fetch Topics in This Subject
      const loadTopicForThisSubject = async () => {
        setFetching(true);
        setError(null);
        try {
          if(!subject){
            return;
          }
          if (!await isOnline()) {
            setError('No internet connection. Please check your connection and try again.');
            return;
          }

          // List all topics and filter client-side for this subject (by name or id)
          const res: any = await fetchAllDocuments('68ca66480039a017b799', 'topic');
          const docs: any[] = res ?? [];

          const filtered = docs.filter(
            (t) =>
              t?.subject === subject.name ||
              t?.subject === subject.$id ||
              (typeof t?.subject === 'object' && (t.subject.$id === subject.$id || t.subject.name === subject.name))
          );

          setTopic(filtered)
        } catch (err) {
          console.error('Error loading topics for subject:', err);
          setError('Failed to load topics. Please try again later.');
        } finally {
          setFetching(false);
        }
      };

      //Load Papers for this Subject
      const LoadPaperForThisSubject = async () =>{
        setFetching(true);
        setError(null);
        try {
          if(!subject){
            return;
          }
          if (!await isOnline()) {
            setError('No internet connection. Please check your connection and try again.');
            return;
          }

          // List all topics and filter client-side for this subject (by name or id)
          const res: any = await fetchAllDocuments('68ca66480039a017b799', 'past_paper');
          const docs: any[] = res ?? [];

          const filtered = docs.filter(
            (t) =>
              t?.subject === subject.name ||
              t?.subject === subject.$id ||
              (typeof t?.subject === 'object' && (t.subject.$id === subject.$id || t.subject.name === subject.name))
          );

          setPaper(filtered)
        } catch (err) {
          console.error('Error loading papers for subject:', err);
          setError('Failed to load papers. Please try again later.');
        } finally {
          setFetching(false);
        }
      }

      if(selectedTab === 'topic'){
        loadTopicForThisSubject();
      } else if(selectedTab === 'paper'){
        LoadPaperForThisSubject();
      }

    }, [subject, selectedTab]);

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A6FA5" />
                <Text style={{ color: '#6B7280', fontSize: 16 }}>Loading subject details...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                    <Text style={{ marginLeft: 8, color: '#374151', fontSize: 16 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }
    if (!subject) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#DC2626" style={{ marginBottom: 16 }} />
                <Text style={{ color: 'red', fontSize: 16 }}>Subject not found.</Text>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                    <Text style={{ marginLeft: 8, color: '#374151', fontSize: 16 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }
  return (
    <SafeAreaView style={styles.container}>
    {/* Add topic Modal */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
            setIsVisible(!isVisible);
        }}
    >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Add New Topic</Text>
                <View style={styles.section}>
                  <Text style={styles.label}>Title: </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, padding: 8, marginBottom: 12 }}
                    value={newTopicData.title}
                    onChangeText={(text) => setNewTopicData({ ...newTopicData, title: text })}
                    placeholder="Enter topic title"
                  />
                  <Text style={styles.label}>Description: </Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 4, padding: 8, marginBottom: 12 }}
                    value={newTopicData.description}
                    onChangeText={(text) => setNewTopicData({ ...newTopicData, description: text })}
                    placeholder="Enter topic description"
                    multiline
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setIsVisible(false)}
                    style={{ padding: 8, backgroundColor: '#E5E7EB', borderRadius: 4 }}
                  >
                    <Text style={{ color: '#374151', fontWeight: '500' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmitNewTopic}
                    style={{ padding: 8, backgroundColor: '#4A6FA5', borderRadius: 4 }}
                    disabled={isSubmitting}
                  >
                    <Text style={{ color: 'white', fontWeight: '500' }}>
                      {isSubmitting ? 'Adding...' : 'Add Topic'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Header with back button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginLeft: 16 }}>Subject Details</Text>
      </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.content}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="book-outline" size={64} color="#4A6FA5" />
                    </View>
                    <Text style={styles.userName}>{subject.name}</Text>
                    {/* Button to show Add topic Modal*/}
                    {user?.role === 'admin' && 
                    <TouchableOpacity
                      onPress={handleAddTopic}
                      style={[styles.actionButton, {alignItems: 'center'}]}
                    >
                      <Text style={styles.actionButtonText}>Add New Topic</Text>
                    </TouchableOpacity>
                    }
                </View>
                {user?.role === 'admin' && 
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subject Information</Text>
                    <InfoRow label="Subject ID" value={subject.$id} icon="id-card-outline" />
                    <InfoRow label="Name" value={subject.name} icon="book-outline" />
                    <InfoRow label="Grade" value={subject.grade.replace('-', ' ').replace('_', ' ')} icon="school-outline" />
                    <InfoRow label="Created At" value={new Date(subject.$createdAt).toLocaleDateString()} icon="calendar-outline" />
                    <InfoRow label="Last Updated" value={new Date(subject.$updatedAt).toLocaleDateString()} icon="time-outline" />
                    <InfoRow label="Created By" value={subject.creater || 'N/A'} icon="person-outline" valueStyle={{ textTransform: 'capitalize' }} />
                </View>
                }
                {/* List Of Topics/Papers in this Subject */}
                <View style={styles.section}>
                  <View style={{ flexDirection: 'row', marginBottom: 12, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4 }}>
                    <TouchableOpacity
                      onPress={() => setSelectedTab('topic')}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 6,
                        alignItems: 'center',
                        backgroundColor: selectedTab === 'topic' ? '#4A6FA5' : 'transparent',
                      }}
                    >
                      <Text style={{ color: selectedTab === 'topic' ? '#fff' : '#374151', fontWeight: '600' }}>Topics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedTab('paper')}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 6,
                        alignItems: 'center',
                        backgroundColor: selectedTab === 'paper' ? '#4A6FA5' : 'transparent',
                      }}
                    >
                      <Text style={{ color: selectedTab === 'paper' ? '#fff' : '#374151', fontWeight: '600' }}>Papers</Text>
                    </TouchableOpacity>
                  </View>

                  {fetching ? (
                    <ActivityIndicator size="small" color="#4A6FA5" />
                  ) : selectedTab === 'topic' ? (
                    <>
                      <Text style={styles.sectionTitle}>Topics</Text>
                      {Array.isArray(topic) && topic.length > 0 ? (
                        topic.map((item: any) => (
                          <TouchableOpacity
                           key={item.$id} 
                           style={styles.actionButton}
                           onPress={async () => {
                            await AsyncStorage.setItem('current_topic', item.title);
                            router.push('/library/NotesScreen' as any);
                           }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>{item.title}</Text>
                              {item.description ? (
                                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{item.description}</Text>
                              ) : null}
                              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Created by: {item.creater || 'N/A'}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.placeholderBox}>
                          <Ionicons name="documents-outline" size={32} color="#9CA3AF" />
                          <Text style={styles.placeholderText}>No topics available for this subject</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={styles.sectionTitle}>Papers</Text>
                      {Array.isArray(paper) && paper.length > 0 ? (
                        paper.map((p: any) => (
                          <TouchableOpacity 
                            key={p.$id} 
                            style={styles.actionButton}
                            onPress={() => router.push(`/admin/papers/${p.$id}`)}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}>{p.title || p.name || 'Untitled Paper'}</Text>
                              {p.description ? (
                                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{p.description}</Text>
                              ) : p.year ? (
                                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Year: {p.year}</Text>
                              ) : null}
                              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Uploaded by: {p.creater || 'N/A'}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.placeholderBox}>
                          <Ionicons name="newspaper-outline" size={32} color="#9CA3AF" />
                          <Text style={styles.placeholderText}>No past papers available for this subject</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Additional Details</Text>
                    <Text style={styles.bioText}>
                        This section can be used to display additional information about the subject, such as a description, related topics, or any other relevant details that might be useful for administrators.
                    </Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
    backButton: {
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
    scrollContainer: {
    paddingBottom: 20,
  },
    label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
    },
    value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    },
    logoutButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 4,
    color: '#2563EB',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A6FA5',
  },
  placeholderBox: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
    errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    }


}
);

export default SubjectDetailsScreen;