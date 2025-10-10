import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Paper = {
  $id: string,
  title: string;
  subject: string;
  year: number;
  type: 'Midterm' | 'Final' | 'Quiz' | 'Practice';
  fileType: 'PDF' | 'DOC' | 'IMAGE';
  uploaded: string;
  downloads: number;
};

const isOnline = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

const PapersScreen = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);


  // load papers from local storage
  const loadPapersLocally = async () => {
    try {
      const storedPapers = await AsyncStorage.getItem('papers');
      return storedPapers ? JSON.parse(storedPapers as any) : [];
    } catch (error) {
      console.error('Error loading papers from local storage:', error);
      return [];
    }
  }

  // load papers from appwrite database
  const loadPapersFromDB = async () => {
    try {
      const pappersFromDB = await databases.listDocuments(
        '68ca66480039a017b799',
        'past_paper',
      );
      return pappersFromDB.documents;
    } catch (error) {
      console.error('Error loading papers from Appwrite:', error);
      return [];
    }
  };

  useEffect( () => {
    setLoading(true);
    (async() => {
      const online = await isOnline();
      let loadedPapers = [];
      try {
        if (online) {
          loadedPapers = await loadPapersFromDB();
          // Save to local storage
          AsyncStorage.setItem('papers', JSON.stringify(loadedPapers));
        } else {
          loadedPapers = await loadPapersLocally();
        }
        setPapers(loadedPapers);
      } catch (error) {
        console.error('Error loading papers:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter papers based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      return;
    }
    const lowercasedQuery = query.toLowerCase();
    const filtered = papers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(lowercasedQuery) ||
        paper.subject.toLowerCase().includes(lowercasedQuery) ||
        paper.year.toString().includes(lowercasedQuery) ||
        paper.type.toLowerCase().includes(lowercasedQuery)
    );
    setPapers(filtered);
  };

  const handlePaperPress = (paperId: string) => {
    console.log("ID sent: ", paperId);
    router.push(`/admin/papers/${paperId}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Final': return '#EF4444';
      case 'Midterm': return '#F59E0B';
      case 'Quiz': return '#10B981';
      default: return '#8B5CF6';
    }
  };

  const renderPaperItem = ({ item }: { item: any }) => {
    const typeColor = getTypeColor(item.type);
    
    return (
      <TouchableOpacity 
        style={styles.paperCard}
        onPress={() => handlePaperPress(item.$id)}
        activeOpacity={0.8}
      >
        <View style={styles.paperIcon}>
          <Ionicons 
            name={item.fileType === 'PDF' ? 'document-text' : 'document-attach'} 
            size={32} 
            color="#3B82F6" 
          />
        </View>
        <View style={styles.paperInfo}>
          <Text style={styles.paperTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <View style={styles.paperMeta}>
            <Text style={styles.paperSubject}>{item.subject}</Text>
            <Text style={styles.paperYear}>{item.year}</Text>
            <View style={[styles.paperType, { backgroundColor: `${typeColor}20` }]}>
              <Text style={[styles.paperTypeText, { color: typeColor }]}>
                {item.type}
              </Text>
            </View>
          </View>
          <View style={styles.paperFooter}>
            <Text style={styles.paperUploaded}>{item.uploaded}</Text>
            <Text style={styles.paperDownloads}>
              <Ionicons name="download-outline" size={14} color="#6B7280" /> {item.downloads}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
      </TouchableOpacity>
    );
  };

  const handleAddPaper = () => {
    router.push('/admin/papers/new');
  };

  

  return (
    <SafeAreaView style={[styles.container, { position: 'relative' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Past Papers</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddPaper}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Paper</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search papers..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#94A3B8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#4A6FA5" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text>Loading...</Text>
        </View>
      ) : papers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="document-text-outline" size={64} color="#CBD5E0" />
          <Text style={{ color: '#6B7280' }}>No papers found.</Text>
        </View>
      ) : (
        <FlatList
          data={papers}
          keyExtractor={(item) => item.$id}
          renderItem={renderPaperItem}
          contentContainerStyle={styles.paperList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddPaper}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};


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
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  paperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  paperIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paperInfo: {
    flex: 1,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  paperMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  paperSubject: {
    fontSize: 13,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  paperYear: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 8,
    marginBottom: 4,
  },
  paperType: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  paperTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paperFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paperUploaded: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paperDownloads: {
    fontSize: 12,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  uploadedText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
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

export default PapersScreen;
