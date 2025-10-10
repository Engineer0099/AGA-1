import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Tip = {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
};

const TipDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, you would fetch this from your API
        const mockTip: Tip = {
          id: id as string,
          title: 'Effective Note-taking',
          content: `# Effective Note-taking Strategies\n\nTaking good notes is a skill that can significantly improve your learning and retention. Here are some proven strategies:\n\n1. **The Cornell Method**\n   - Divide your paper into three sections: notes, cues, and summary\n   - Take notes in the main section\n   - Add cues/questions in the left margin\n   - Summarize the main points at the bottom\n\n2. **Mind Mapping**\n   - Start with a central concept\n   - Branch out with related ideas\n   - Use colors and images to enhance memory\n\n3. **The Outline Method**\n   - Use headings and bullet points\n   - Indent supporting details\n   - Great for structured lectures\n\n4. **The Charting Method**\n   - Create columns for categories\n   - Fill in information in rows\n   - Ideal for comparing information\n\nRemember to review your notes within 24 hours for better retention!`,
          category: 'Study Tips',
          status: 'published',
          createdAt: '2023-10-15T10:30:00Z',
          updatedAt: '2023-10-15T10:30:00Z',
        };
        
        setTip(mockTip);
      } catch (err) {
        console.error('Error fetching tip:', err);
        setError('Failed to load tip. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/admin/tips/${id}/edit`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Tip',
      'Are you sure you want to delete this tip? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 500));
              // In a real app, you would call your API here
              // await api.deleteTip(id);
              
              router.replace('/admin/tips');
            } catch (error) {
              console.error('Error deleting tip:', error);
              Alert.alert('Error', 'Failed to delete tip. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${tip?.title}\n\n${tip?.content.substring(0, 200)}...\n\nShared via AGA App`,
        title: tip?.title,
      });
    } catch (error) {
      console.error('Error sharing tip:', error);
      Alert.alert('Error', 'Failed to share tip. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'archived': return '#6B7280';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry fetching the tip
            setTimeout(() => {
              setLoading(false);
              setTip({
                id: id as string,
                title: 'Effective Note-taking',
                content: 'Content would be loaded here...',
                category: 'Study Tips',
                status: 'published',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }, 500);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tip Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={20} color="#4A6FA5" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { marginLeft: 12 }]}
            onPress={handleEdit}
          >
            <Ionicons name="create" size={20} color="#4A6FA5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tip?.status || '') + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(tip?.status || '') }]} />
            <Text style={[styles.statusText, { color: getStatusColor(tip?.status || '') }]}>
              {(tip?.status || '').charAt(0).toUpperCase() + (tip?.status || '').slice(1)}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {tip?.updatedAt ? new Date(tip.updatedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <Text style={styles.category}>{tip?.category || 'Uncategorized'}</Text>
        <Text style={styles.title}>{tip?.title || 'Untitled Tip'}</Text>
        
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            {tip?.content}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerButton, { backgroundColor: '#FEE2E2' }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#DC2626" />
          <Text style={[styles.footerButtonText, { color: '#DC2626' }]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerButton, { backgroundColor: '#4A6FA5' }]}
          onPress={handleEdit}
        >
          <Ionicons name="create" size={20} color="#FFFFFF" />
          <Text style={[styles.footerButtonText, { color: '#FFFFFF' }]}>Edit</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  category: {
    fontSize: 14,
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 32,
  },
  contentContainer: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  footerButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TipDetailScreen;
