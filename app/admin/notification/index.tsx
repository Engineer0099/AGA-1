import { databases } from '@/lib/appwrite';
import { isOnline } from '@/utils/online';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Notification = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const NotificationScreen = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  

  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsData, setNotificationsData] = useState<Notification[]>([]);
  const [dataLoaded , setDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // load Published Notifications from appwrite database
  const loadNotificationsFromDatabase = async () => {
    try {
      const response = await databases.listDocuments('68ca66480039a017b799', 'notification');
      const fetchedNotifications = response?.documents?.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        content: doc.message,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
      return fetchedNotifications
    } catch (error) {
      console.error('Error fetching Notifications:', error);
      return [];
    }
  };

  //load Published Notifications from local storage
  const loadNotificationsLocally = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notification');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error('Error loading Notifications from local storage:', error);
      return [];
    }
  };

  // Load Notifications on refresh
  useEffect(() => {
    if (!dataLoaded) {
      setIsLoading(true);
      (async () => {
        try {
          const online = await isOnline();
          let Notifications = [];
          //let draftNotifications = [];
          if (online) {
            Notifications = await loadNotificationsFromDatabase();
            //draftNotifications = await loadDraftNotificationsFromDatabase();

            // Save fetched Notifications to local storage for offline access
            await AsyncStorage.setItem('notification', JSON.stringify(Notifications));
            //await AsyncStorage.setItem('draft_Notifications', JSON.stringify(draftNotifications));
          } else {
            Notifications = await loadNotificationsLocally();
            //draftNotifications = await loadDraftNotificationsLocally();

            // Save fetched Notifications to local storage for offline access
            await AsyncStorage.setItem('notification', JSON.stringify(Notifications));
            //await AsyncStorage.setItem('draft_Notifications', JSON.stringify(draftNotifications));
          }
          //const allNotifications = [...publishedNotifications, ...draftNotifications];
          const allNotifications = [...Notifications];
          // Sort Notifications by updatedAt date in descending order
          allNotifications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setNotificationsData(allNotifications as any);
        } catch (error) {
          console.error('Error loading Notifications:', error);
        } finally {
          setDataLoaded(true);
          setIsLoading(false);
        }
      })();
    }
  }, [dataLoaded]);


  const filteredNotifications = notificationsData.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleNotificationPress = (notificationId: string) => {
    router.push(`/admin/notification/${notificationId}`);
  };

  const handleAddNotification = () => {
    router.push('/admin/notification/new');
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={styles.notificationCard}
      onPress={() => handleNotificationPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
        </View>
        <Text style={styles.notificationExcerpt} numberOfLines={2} ellipsizeMode="tail">
          {item.content}
        </Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationDate}>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddNotification}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Notification</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Notifications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={{ color: '#6B7280', fontSize: 16 }}>Loading Notifications...</Text>
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No Notifications Found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or filter to find what you&apos;re looking for.
          </Text>
        </View>
      ) : (
        <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bulb-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No Notifications found</Text>
            <Text style={styles.emptyStateSubtext}>Try adding a new notification or adjusting your search</Text>
          </View>
        }
      />
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddNotification}
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
  notificationCard: {
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
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
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
  notificationCategory: {
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
  notificationExcerpt: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  notificationDate: {
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

export default NotificationScreen;
