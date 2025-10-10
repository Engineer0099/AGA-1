import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Tip = {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
};

const isOnline = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

const TipsScreen = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [tipsData, setTipsData] = useState<Tip[]>([]);
  const [dataLoaded , setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // load Published tips from appwrite database
  const loadPublishedTipsFromDatabase = async () => {
    try {
      const response = await databases.listDocuments('68ca66480039a017b799', 'study_tip');
      const fetchedTips = response.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        status: 'published', // Assuming all fetched tips are published
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
      return fetchedTips
    } catch (error) {
      console.error('Error fetching tips:', error);
      return [];
    }
  };

  //load Published Tips from local storage
  const loadPublishedTipsLocally = async () => {
    try {
      const storedTips = await AsyncStorage.getItem('study_tips');
      return storedTips ? JSON.parse(storedTips) : [];
    } catch (error) {
      console.error('Error loading published tips from local storage:', error);
      return [];
    }
  };

  //load Draft Tips from database
  const loadDraftTipsFromDatabase = async () => {
    try {
      const response = await databases.listDocuments('68ca66480039a017b799', 'draft_tip');
      const fetchedTips = response.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        status: 'draft', // Assuming all fetched tips are drafts
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
      return fetchedTips
    } catch (error) {
      console.error('Error fetching draft tips:', error);
      return [];
    }
  };

  //load Draft Tips from local storage
  const loadDraftTipsLocally = async () => {
    try {
      const storedTips = await AsyncStorage.getItem('draft_tips');
      return storedTips ? JSON.parse(storedTips) : [];
    } catch (error) {
      console.error('Error loading draft tips from local storage:', error);
      return [];
    }
  };

  // Load tips on refresh
  useEffect(() => {
    if (!dataLoaded) {
      setIsLoading(true);
      (async () => {
        try {
          const online = await isOnline();
          let publishedTips = [];
          let draftTips = [];
          if (online) {
            publishedTips = await loadPublishedTipsFromDatabase();
            draftTips = await loadDraftTipsFromDatabase();

            // Save fetched tips to local storage for offline access
            await AsyncStorage.setItem('study_tips', JSON.stringify(publishedTips));
            await AsyncStorage.setItem('draft_tips', JSON.stringify(draftTips));
          } else {
            publishedTips = await loadPublishedTipsLocally();
            draftTips = await loadDraftTipsLocally();

            // Save fetched tips to local storage for offline access
            await AsyncStorage.setItem('study_tips', JSON.stringify(publishedTips));
            await AsyncStorage.setItem('draft_tips', JSON.stringify(draftTips));
          }
          const allTips = [...publishedTips, ...draftTips];
          // Sort tips by updatedAt date in descending order
          allTips.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setTipsData(allTips as any);
        } catch (error) {
          console.error('Error loading tips:', error);
        } finally {
          setDataLoaded(true);
          setIsLoading(false);
        }
      })();
    }
  }, [dataLoaded]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'archived': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const filteredTips = tipsData.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tip.category === selectedCategory;
    const matchesStatus = !selectedStatus || tip.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleTipPress = (tipId: string) => {
    router.push(`/admin/tips/${tipId}`);
  };

  const handleAddTip = () => {
    router.push('/admin/tips/new');
  };

  const renderTipItem = ({ item }: { item: Tip }) => (
    <TouchableOpacity 
      style={styles.tipCard}
      onPress={() => handleTipPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.tipContent}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.tipCategory}>{item.category}</Text>
        <Text style={styles.tipExcerpt} numberOfLines={2} ellipsizeMode="tail">
          {item.content}
        </Text>
        <View style={styles.tipFooter}>
          <Text style={styles.tipDate}>
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
        <Text style={styles.headerTitle}>Tips</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddTip}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Tip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tips..."
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
          <TouchableOpacity 
            style={[styles.filterPill, !selectedCategory && styles.filterPillActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterText, !selectedCategory && styles.filterTextActive]}>All Categories</Text>
          </TouchableOpacity>
          {['study' , 'exam' , 'motivation', 'other' ].map(category => (
            <TouchableOpacity 
              key={category}
              style={[styles.filterPill, selectedCategory === category && styles.filterPillActive]}
              onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
            >
              <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={{ color: '#6B7280', fontSize: 16 }}>Loading tips...</Text>
        </View>
      ) : filteredTips.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No Tips Found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filter to find what you&apos;re looking for.
          </Text>
        </View>
      ) : (
        <FlatList
        data={filteredTips}
        renderItem={renderTipItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No tips found</Text>
            <Text style={styles.emptyStateSubtext}>Try adding a new tip or adjusting your search</Text>
          </View>
        }
      />
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddTip}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  tipCard: {
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
  tipContent: {
    flex: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
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
  tipCategory: {
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
  tipExcerpt: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  tipDate: {
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

export default TipsScreen;
