import { useUser } from '@/hooks/useUser';
import { databases } from '@/lib/appwrite';
import { isOnline } from '@/utils/online';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Subject = {
    id: string;
    name: string;
    grade: string;
    createdAt: string;
    updatedAt: string;
};


const SubjectScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  
  const handleBack = () => {
    router.back();
  };
  

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [subjectData, setSubjectData] = useState<Subject[]>([]);
  const [dataLoaded , setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // load subject from appwrite database
  const loadSubjectFromDatabase = async () => {
    try {
      const response = await databases.listDocuments('68ca66480039a017b799', 'subject');
      const fetchedSubjects = response?.documents?.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        grade: doc.grade,
        creater: doc.user,
        no_of_topics: doc.no_of_topics,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
      //setSelectedGrade(fetchedSubjects as any);
      return fetchedSubjects
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  };

  //load Subject from local storage
  const loadSubjectsLocally = async () => {
    try {
      const storedSubjects = await AsyncStorage.getItem('subjects');
      return storedSubjects ? JSON.parse(storedSubjects) : [];
    } catch (error) {
      console.error('Error loading published subjects from local storage:', error);
      return [];
    }
  };


  // Load subject on refresh
  useEffect(() => {
    if (!dataLoaded) {
      setIsLoading(true);
      let subjects = [];
      (async () => {
        try {
          const online = await isOnline();
          if (online) {
            subjects = await loadSubjectFromDatabase();

            // Save fetched subject to local storage for offline access
            await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
          } else {
            subjects = await loadSubjectsLocally();

            // Save fetched subjects to local storage for offline access
            await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
          }
          setSubjectData(subjects as any);
        } catch (error) {
          console.error('Error loading subjects:', error);
        } finally {
          if(user?.role !== 'admin'){
            const grade = await AsyncStorage.getItem('current_grade');
            console.log(subjects, grade);
            const filtered = subjects.filter(
              (t: any) =>
                t?.grade === grade
            );
            console.log("subject(s) found", filtered);
            setSubjectData(filtered);
          }
          setDataLoaded(true);
          setIsLoading(false);
        }
      })();
    }
  }, [dataLoaded]);


  const filteredSubjects = subjectData.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         subject.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !selectedGrade || subject.grade === selectedGrade;
    if(user?.role === 'admin'){
      return matchesSearch && matchesGrade;
    }
    return matchesSearch;
  });
  console.log("Hey ",subjectData, filteredSubjects)

  const handleSubjectPress = (subjectId: string) => {
    router.push(`/admin/subjects/${subjectId}`);
  };

  const handleAddSubject = () => {
    router.push('/admin/subjects/new');
  };

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity 
      style={styles.subjectCard}
      onPress={() => handleSubjectPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.subjectContent}>
        <View style={styles.subjectHeader}>
          <Text style={styles.subjectTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
        <Text style={styles.subjectGrade}>{item.grade.replace('-', ' ').replace('_', ' ')}</Text>
        <View style={styles.subjectFooter}>
          <Text style={styles.subjectDate}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { position: 'relative' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subjects</Text>
        {user?.role === 'admin' && 
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddSubject}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Subject</Text>
          </TouchableOpacity>
        </View>
        }
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search subjects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {user?.role === 'admin' && 
          <TouchableOpacity 
            style={[styles.filterPill, !selectedGrade && styles.filterPillActive]}
            onPress={() => setSelectedGrade(null)}
          >
            <Text style={[styles.filterText, !selectedGrade && styles.filterTextActive]}>All Grades</Text>
          </TouchableOpacity>
          }
          {user?.role === 'admin' && ['standard_4' , 'standard_7' , 'form-2', 'form-4', 'form-6', 'university' ].map(grade => (
            <TouchableOpacity 
              key={grade}
              style={[styles.filterPill, selectedGrade === grade && styles.filterPillActive]}
              onPress={() => setSelectedGrade(grade === selectedGrade ? null : grade)}
            >
              <Text style={[styles.filterText, selectedGrade === grade && styles.filterTextActive]}>
                {grade.replace('-', ' ').replace('_', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={{ color: '#6B7280', fontSize: 16 }}>Loading subjects...</Text>
        </View>
      ) : filteredSubjects.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No Subjects Found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filter to find what you&apos;re looking for.
          </Text>
        </View>
      ) : (
        <FlatList
        data={filteredSubjects}
        renderItem={renderSubjectItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No subjects found</Text>
            <Text style={styles.emptyStateSubtext}>Try adding a new subject or adjusting your search</Text>
          </View>
        }
      />
      )}
      
      {/* Floating Action Button */}
      {user?.role === 'admin' && 
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddSubject}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      }
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

export default SubjectScreen;
