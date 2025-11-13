import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

type Notification = {
  $id: string;
  title: string;
  content: string;
  $createdAt: string;
  $updatedAt: string;
};

const NotificationDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const notification = await databases.listDocuments({
          databaseId: '68ca66480039a017b799',
          collectionId: 'notification',
          queries: [
            Query.equal('$id', id)
          ]
        });
        const fetchedNotification = notification?.documents?.map((doc: any) => ({
          id: doc.$id,
          title: doc.title,
          content: doc.message,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
        }))
        console.log("Fetch with id: ",id);
        console.log("Fetched Notification: ", fetchedNotification[0]);
        setNotification(fetchedNotification[0] as any);
      } catch (err) {
        console.error('Error fetching Notification:', err);
        setError('Failed to load Notification. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/admin/tips/${id}/editNotification`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this Notification? This action cannot be undone.',
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
              await databases.deleteDocument(
                '68ca66480039a017b799',
                'notification', 
                id as string
              );
              
              router.replace('/admin/notification');
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete notification. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${notification?.title}\n\n${notification?.content.substring(0, 200)}...\n\nShared via AGA App`,
        title: notification?.title,
      });
    } catch (error) {
      console.error('Error sharing notification:', error);
      Alert.alert('Error', 'Failed to share notification. Please try again.');
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
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
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
          <Text style={styles.dateText}>
            {notification?.$updatedAt ? new Date(notification.$updatedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <Text style={styles.title}>{notification?.title || 'Untitled Notification'}</Text>
        
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            {notification?.content}
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

export default NotificationDetailScreen;
