import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Note = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  creater: string;
  pages: number;
  fileType: 'PDF' | 'DOC' | 'PPT';
  uploaded: string;
  downloads: number;
  description?: string;
  fileSize?: string;
  fileId: string;
};

//Function to Fetch Notes by Id From database
const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const doc = await databases.getDocument('68ca66480039a017b799', 'notes', id);

    return {
      id: doc.$id,
      title: doc.title || '',
      subject: doc.subject || '',
      topic: doc.topic || '',
      creater: doc.creater || '',
      pages: Number(doc.pages) || 0,
      fileType: (doc.fileType as Note['fileType']) || 'PDF',
      uploaded: doc.uploaded || '',
      downloads: Number(doc.downloads) || 0,
      description: doc.description,
      fileSize: doc.fileSize,
      fileId: doc.fileId,
    };
  } catch (err) {
    console.error('fetchNoteById error:', err);
    return null;
  }
};

const NoteDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        
        const foundNote = await fetchNoteById(id as string);
        
        if (foundNote) {
          setNote(foundNote);
        } else {
          setError('Note not found');
        }
      } catch (err) {
        setError('Failed to load note details');
        console.error('Error fetching note:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleView = () => {
    router.push(`/fileView/${note?.fileId}`as any);
  };

  const handleDownload = () => {
    // Implement download functionality
    Alert.alert('Download', 'Starting download...');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this note: ${note?.title} - ${note?.description?.substring(0, 100)}...`,
        title: note?.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share note');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return 'document-text';
      case 'DOC': return 'document';
      case 'PPT': return 'document-attach';
      default: return 'document';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !note) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Note not found'}</Text>
        <TouchableOpacity 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: '#EFF6FF',
            borderRadius: 8,
            marginTop: 16,
          }}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={20} color="#3B82F6" />
          <Text style={{ color: '#3B82F6', marginLeft: 8 }}>Back to Notes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Note Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#4A6FA5',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.noteHeader}>
          <View style={styles.noteIconContainer}>
            <Ionicons 
              name={getFileIcon(note.fileType)} 
              size={48} 
              color="#3B82F6" 
            />
          </View>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteAuthor}>By {note.creater}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="book" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{note.subject}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="pricetag" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{note.topic}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{note.fileType} • {note.pages} pages • {note.fileSize}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time" size={20} color="#6B7280" />
            <Text style={styles.detailText}>Uploaded {note.uploaded}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="download" size={20} color="#6B7280" />
            <Text style={styles.detailText}>{note.downloads} downloads</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {note.description || 'No description available.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={handleView}
        >
          <Ionicons name="eye" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton]}
          onPress={handleDownload}
        >
          <Ionicons name="download" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  // Header styles removed as we're using Stack header
  content: {
    flex: 1,
    padding: 16,
  },
  noteHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  noteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  noteAuthor: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsContainer: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
  },
  descriptionContainer: {
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
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  viewButton: {
    backgroundColor: '#3B82F6',
  },
  downloadButton: {
    backgroundColor: '#10B981',
  },
  shareButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NoteDetailScreen;
