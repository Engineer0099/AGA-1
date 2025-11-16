import { useUser } from '@/hooks/useUser';
import { fetchAllDocuments, isOnline } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Note = {
  $id: string;
  title: string;
  subject: string;
  topic: string;
  creater: string;
  pages: number;
  fileType: 'PDF' | 'DOC' | 'PPT';
  uploaded: string;
  downloads: number;
};


const NotesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useUser();

  
  const handleBack = () => {
    router.back();
  };

  
    const handleNotePress = (id: string) => {
      // navigate to the note detail screen
      router.push(`/admin/notes/${id}`);
    };
  


  //Load notes from Database
  const LoadNotesFromDb = async (): Promise<Note[]> => {
    try{
      const loadedData = await fetchAllDocuments('68ca66480039a017b799', 'notes');
      // appwrite returns { documents: [...] } — fall back to loadedData if shape differs
      //const docs = (loadedData as any).documents ?? (loadedData as any);
      const notesArray = (loadedData as Note[]) || [];
      setNotes(notesArray);
      return notesArray;
    } catch(err) {
      console.log("Error Fetching Notes From Database", err);
      setNotes([]);
      return [];
    }
  }

  // Load Notes Locally
  const LoadNotesLocally = async (): Promise<Note[]> => {
    try{
      const loadedNotes = await AsyncStorage.getItem('notes');
      const parsed = loadedNotes ? (JSON.parse(loadedNotes) as Note[]) : [];
      setNotes(parsed);
      return parsed;
    } catch(err){
      console.log('Error fetching Notes Locally', err);
      setNotes([]);
      return [];
    }
    
  }

  //Save Notes Locally
  const SaveNotesLocally = async (saveNotes: Note[]) => {
    try{
      await AsyncStorage.setItem('notes', JSON.stringify(saveNotes));
    } catch (err){
      console.log('Error Saving Notes Locally', err);
    }
  };
  
  useEffect( () => {
    setLoading(true);
    (async() => {
      const online = await isOnline();
      let fetchedNotes: Note[] = [];
      if(online){
        try{
          fetchedNotes = await LoadNotesFromDb();
          await SaveNotesLocally(fetchedNotes);
        } catch (err){
          console.log('Error Fetching Notes Online', err);
        } finally {
            const topic = await AsyncStorage.getItem('current_topic');
            const filtered = fetchedNotes.filter(
              (t) =>
                t?.topic === topic
            );
            setNotes(filtered);
        }
        
      } else {
        try {
          fetchedNotes = await LoadNotesLocally();
        } catch (err) {
          console.log('Error Fetching Notes Locally', err);
        } finally {
            const topic = await AsyncStorage.getItem('current_topic');
            const filtered = fetchedNotes.filter(
              (t) =>
                t?.topic === topic
            );
            setNotes(filtered);
        }
    }
        setLoading(false);
        console.log(fetchedNotes);
    })()
  }, []);
          

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity 
      style={styles.noteCard}
      onPress={() => handleNotePress(item.$id)}
      activeOpacity={0.9}
    >
      <View style={styles.noteIcon}>
        <Ionicons 
          name={item.fileType === 'PDF' ? 'document-text' : 'document-attach'} 
          size={32}
          color="#4F46E5" 
        />
      </View>
      
      <View style={styles.noteContent}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.noteType}>{item.fileType}</Text>
        </View>
        
        <View style={styles.noteMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="book" size={14} color="#64748B" />
            <Text style={styles.metaText}>{item.subject}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag" size={14} color="#64748B" />
            <Text style={styles.metaText}>{item.topic}</Text>
          </View>
        </View>
        
        <View style={styles.noteFooter}>
          <View style={styles.authorInfo}>
            <Ionicons name="person-circle" size={16} color="#94A3B8" />
            <Text style={styles.authorName}>{item.creater}</Text>
          </View>
          
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={(e) => {
          e.stopPropagation(); // Prevent navigation when menu is clicked
          // Add menu functionality here
        }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || note.fileType === selectedType;
    return matchesSearch && matchesType;
  });

//   const subjects = [...new Set(notes.map(note => note.subject))];
  const fileTypes = [...new Set(notes.map(note => note.fileType))];

  const handleAddNote = () => {
    router.push('/admin/notes/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Notes</Text>
        {user?.role === 'admin' && 
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddNote}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
        }
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={{marginBottom: 15}}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {fileTypes.map(type => (
            <TouchableOpacity 
              key={type}
              style={[
                styles.filterPill,
                selectedType === type && styles.filterPillActive
              ]}
              onPress={() => setSelectedType(selectedType === type ? null : type)}
            >
              <Text style={[
                styles.filterText,
                selectedType === type && styles.filterTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text>Loading...</Text>
        </View>
      ) : (
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.$id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No notes found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
      )}
      
      {/* Floating Action Button */}
      {user?.role === 'admin' && 
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddNote}
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
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A6FA5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 16,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 15,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 6,
    marginBottom: -4,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 32,
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  filterText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  notesList: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  noteIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  noteContent: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  noteType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  noteMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  uploadedText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  menuButton: {
    marginLeft: 12,
    padding: 4,
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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

export default NotesScreen;
