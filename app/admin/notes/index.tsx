import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type Note = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  author: string;
  pages: number;
  fileType: 'PDF' | 'DOC' | 'PPT';
  uploaded: string;
  downloads: number;
};

const NotesScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const handleBack = () => {
    router.back();
  };

  // Mock data - replace with actual data from your API
  const notes: Note[] = [
    {
      id: '1',
      title: 'Calculus Basics',
      subject: 'Mathematics',
      topic: 'Differential Calculus',
      author: 'Dr. Smith',
      pages: 24,
      fileType: 'PDF',
      uploaded: '3 days ago',
      downloads: 189,
    },
    {
      id: '2',
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      author: 'Prof. Johnson',
      pages: 18,
      fileType: 'PDF',
      uploaded: '1 week ago',
      downloads: 245,
    },
    {
      id: '3',
      title: 'Classical Mechanics',
      subject: 'Physics',
      topic: 'Mechanics',
      author: 'Dr. Williams',
      pages: 32,
      fileType: 'PPT',
      uploaded: '5 days ago',
      downloads: 156,
    },
  ];

  const handleNotePress = (noteId: string) => {
    router.push(`/admin/notes/${noteId}`);
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity 
      style={styles.noteCard}
      onPress={() => handleNotePress(item.id)}
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
            <Text style={styles.authorName}>{item.author}</Text>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="document" size={14} color="#94A3B8" />
              <Text style={styles.statText}>{item.pages} pages</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="download" size={14} color="#94A3B8" />
              <Text style={styles.statText}>{item.downloads}</Text>
            </View>
            <Text style={styles.uploadedText}>{item.uploaded}</Text>
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
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const matchesType = !selectedType || note.fileType === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const subjects = [...new Set(notes.map(note => note.subject))];
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
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddNote}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
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
          {subjects.map(subject => (
            <TouchableOpacity 
              key={subject}
              style={[
                styles.filterPill,
                selectedSubject === subject && styles.filterPillActive
              ]}
              onPress={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
            >
              <Text style={[
                styles.filterText,
                selectedSubject === subject && styles.filterTextActive
              ]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
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

      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No notes found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddNote}
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
