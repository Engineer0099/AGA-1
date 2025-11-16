import { account } from '@/lib/appwrite';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../hooks/useUser';
import { fetchAllDocuments, isOnline } from '../../utils/util';

// Define types for tips and notifications
type TipCategory = 'all' | 'study' | 'exam' | 'motivation' | 'other';

type Tip = {
  id: string;
  title: string;
  content: string;
  category: 'study' | 'exam' | 'motivation' | 'other';
  saved: boolean;
  readTime: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'material' | 'reminder' | 'study';
};

// save all tips locally
const saveTipsLocally = async (tips: Tip[]) => {
  try {
    await AsyncStorage.setItem('study_tips', JSON.stringify(tips));
  } catch (error) {
    console.error('Error saving tips locally:', error);
  }
};

// Save saved tips locally
const saveSavedTipsLocally = async (savedTips: string[]) => {
  try {
    await AsyncStorage.setItem('saved_tips', JSON.stringify(savedTips));
  } catch (error) {
    console.error('Error saving saved tips locally:', error);
  }
};

// load all tips from local storage
const loadTipsLocally = async (): Promise<Tip[] | null> => {
  try {
    const tipsString = await AsyncStorage.getItem('study_tips');
    return tipsString ? JSON.parse(tipsString) : null;
  } catch (error) {
    console.error('Error loading tips locally:', error);
    return null;
  }
};

// load saved tips from local storage
const loadSavedTipsLocally = async (): Promise<string[] | null> => {
  try {
    const savedTipsString = await AsyncStorage.getItem('saved_tips');
    return savedTipsString ? JSON.parse(savedTipsString) : null;
  } catch (error) {
    console.error('Error loading saved tips locally:', error);
    return null;
  }
};

// load tips from appwrite database
const fetchTipsFromDatabase = async (): Promise<Tip[]> => {
  try {
    const response = await fetchAllDocuments('68ca66480039a017b799', 'study_tip');
    // Cast via unknown first to satisfy TypeScript when the external SDK returns a generic document type.
    return response as unknown as Tip[];
  } catch (error) {
    console.error('Error fetching tips from database:', error);
    return [];
  }
};

// save all notifications locally
const saveNotificationsLocally = async (notifications: Notification[]) => {
  try {
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications locally:', error);
  }
};

// Save read notifications locally
const saveReadNotificationsLocally = async (readNotifications: string[]) => {
  try {
    await AsyncStorage.setItem('read_notifications', JSON.stringify(readNotifications));
  } catch (error) {
    console.error('Error saving read notifications locally:', error);
  }
};

// load read notifications from local storage
const loadReadNotificationsLocally = async (): Promise<string[] | null> => {
  try {
    const readNotifsString = await AsyncStorage.getItem('read_notifications');
    return readNotifsString ? JSON.parse(readNotifsString) : null;
  } catch (error) {
    console.error('Error loading read notifications locally:', error);
    return null;
  }
};

// load notifications from local storage
const loadNotificationsLocally = async (): Promise<Notification[] | null> => {
  try {
    const notificationsString = await AsyncStorage.getItem('notifications');
    return notificationsString ? JSON.parse(notificationsString) : null;
  } catch (error) {
    console.error('Error loading notifications locally:', error);
    return null;
  }
};

// load notifications from appwrite database
const fetchNotificationsFromDatabase = async (): Promise<Notification[]> => {
  try {
    const response = await fetchAllDocuments('68ca66480039a017b799', 'notification');
    // Cast via unknown first to satisfy TypeScript when the external SDK returns a generic document type.
    return response as unknown as Notification[];
  } catch (error) {
    console.error('Error fetching notifications from database:', error);
    return [];
  }
};



export default function ExtrasScreen() {
  const [activeTab, setActiveTab] = useState<'tips' | 'notifications' | 'settings'>('tips');
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCategory, setActiveCategory] = useState<TipCategory>('all');
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [notificationValue, setNotificationValue] = useState(true);

  // trigger one-time load: fetch from DB when online, otherwise load from local storage
  useEffect(() => {
    if (!dataLoaded) {
      (async () => {
        setIsLoading(true);
        try {
          if (await isOnline()) {
            console.log('Online: fetching data from database');
            // fetch tips from DB and save locally
            const tipsFromDb = await fetchTipsFromDatabase();
            if (tipsFromDb && (tipsFromDb as any).length) {
              await saveTipsLocally(tipsFromDb as any);
              setTips(tipsFromDb as any);
            }

            // fetch notifications from DB and save locally
            const notifsFromDb = await fetchNotificationsFromDatabase();
            const readNotifications = await loadReadNotificationsLocally() || [];
            if (notifsFromDb && (notifsFromDb as any).length) {
              // ensure read property exists on each item
              const normalizedNotifs = (notifsFromDb as any).map((n: any) => ({
                ...n,
                read: readNotifications.includes(n.$id),
              }));
              await saveNotificationsLocally(normalizedNotifs);
              setNotifications(normalizedNotifs);
            }
            
          } else {
            console.log('Offline: loading data from local storage');
            // offline: load from local storage
            const localTips = await loadTipsLocally();
            if (localTips && (localTips as any).length) {
              setTips(localTips as any);
            }

            const localNotifs = await loadNotificationsLocally();
            if (localNotifs && (localNotifs as any).length) {
              setNotifications(localNotifs as any);
            }
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          // load saved tips (bookmarks)
          await loadSavedTipsLocally().then((loadedSavedTips) => {
            if (loadedSavedTips) {
              setSavedTips(loadedSavedTips);
            }
          });
          // load read notifications
          await loadReadNotificationsLocally().then((loadedNotifs) => {
            if (loadedNotifs) {
              setReadNotifications(loadedNotifs);
            }
          });

          
          setIsLoading(false);
          setDataLoaded(true);
        }
      })();
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTips = activeCategory === 'all'
    ? tips
    : tips.filter(tip => tip.category === activeCategory);

  const toggleSaveTip = async (tipId: string) => {
    let updated: string[];
    if (savedTips.includes(tipId)) {
      updated = savedTips.filter(id => id !== tipId);
    } else {
      updated = [...savedTips, tipId];
    }

    console.log('Saved tips updated:', updated);
    setSavedTips(updated);
    await saveSavedTipsLocally(updated);
  };

  // mark a notification as read
  const markAsRead = async (notificationId: string) => {
    let updated: string[];
    if (!readNotifications.includes(notificationId)) {
      updated = [...readNotifications, notificationId];
      setReadNotifications(updated);
      await saveReadNotificationsLocally(updated);

      // also update notifications state to reflect read status
      const updatedNotifs = notifications.map(n => 
        (n as any).$id === notificationId ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifs);
      await saveNotificationsLocally(updatedNotifs);
    }
  };

  const renderTipsTab = () => (
    <View>
      <View style={styles.categoryContainer}>
        {(['all', 'study', 'exam', 'motivation'] as TipCategory[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text>Loading tips...</Text>
        </View>
      ) : filteredTips.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Ionicons name="alert-circle" size={48} color="#9CA3AF" />
          <Text style={{ color: '#6B7280' }}>No tips available in this category.</Text>
        </View>
      ) : (
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip, idx) => {
            // use tip.id if present, else fallback to index for unique key
            const key = (tip as any).id ?? (tip as any).$id ?? idx.toString();
            return (
              <View key={key} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <TouchableOpacity onPress={() => toggleSaveTip(key)}>
                    <Ionicons
                      name={savedTips.includes(key) ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={savedTips.includes(key) ? '#4A6FA5' : '#9CA3AF'}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.tipContent}>{tip.content}</Text>
                <View style={styles.tipFooter}>
                  <Text style={styles.readTime}>{tip.readTime} read</Text>
                  <View style={styles.tipCategory}>
                    <MaterialIcons
                      name={tip.category === 'study' ? 'menu-book' : tip.category === 'exam' ? 'assignment' : 'emoji-events'}
                      size={16}
                      color="#4A6FA5"
                    />
                    <Text style={styles.tipCategoryText}>
                      {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.notificationsContainer}>
      <View style={styles.notificationsHeader}>
        <Text style={styles.sectionTitle}>New</Text>
        <TouchableOpacity
          onPress={async () => {
            // mark all as read and persist the updated array
            const updatedAll = notifications.map(n => ({ ...n, read: true }));
            notifications.forEach(n => {
              if (!(n as any).read) {
                readNotifications.push((n as any).$id);
              }
            });
            setNotifications(updatedAll);
            await saveNotificationsLocally(updatedAll);
            await saveReadNotificationsLocally(readNotifications);
          }}
        >
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
          <Text style={{ color: '#6B7280' }}>No notifications available.</Text>
        </View>
      ) : (
        <>
          {notifications.filter(n => !n.read).map((notification, idx) => (
            <NotificationItem
              key={(notification).id ?? (notification as any).$id ?? idx.toString()}
              notification={notification}
              onPress={() => markAsRead((notification as any).id ?? (notification as any).$id ?? idx.toString())}
            />
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Earlier</Text>
          {notifications.filter(n => n.read).map((notification, idx) => (
            <NotificationItem
              key={(notification as any).id ?? `read-${idx}`}
              notification={notification}
              onPress={() => { }}
            />
          ))}
        </>
      )}
    </View>
  );

  const handleLogout = async () => {
    try {
      // End the user session
      await account.deleteSession('current');
    } catch (error) {
      // ignore error if delete failed
      console.log('deleteSession error', error);
    }
    try {
      // Clear any stored tokens or user data
      await SecureStore.deleteItemAsync('user_token');
    } catch (err) {
      console.warn('Failed to delete user_token from SecureStore', err);
    }
    setUser(null);
    // Navigate to sign-in screen
    router.replace('/(auth)/signin');
  };

  const renderSettingsTab = () => (
    <View style={styles.settingsContainer}>
      <Text style={styles.sectionTitle}>Settings</Text>

      {/* Admin Access Button */}
      {/* <TouchableOpacity
        style={[styles.settingItem, { marginBottom: 16 }]}
        onPress={handleAdminAccess}
      >
        <View style={styles.settingIcon}>
          <Ionicons name="shield" size={24} color="#3b82f6" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Admin Dashboard</Text>
          <Text style={styles.settingDescription}>Access admin controls</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </TouchableOpacity> */}

      {user?.role === 'admin' && (
        <SettingItem
          icon="shield-checkmark"
          title="Admin Dashboard"
          onPress={() => router.replace("/admin")}
        />
      )}

      <SettingItem
        icon="notifications"
        title="Notifications"
        value={notificationValue ? 'On' : 'Off'}
        onPress={() => { setNotificationValue(!notificationValue) }}
      />

      <SettingItem
        icon="help"
        title="Help & Support"
        onPress={() => router.push("/extras/HelpAndSupport")}
      />

      <SettingItem
      icon='person-outline'
      title='My Profile'
      onPress={() => router.push("/admin/profile")}
      />
      {/* <View>
        {user ? (
          <View style={styles.settingItem}>
            <Text>User: {user.name}</Text>
            <Text>Email: {user.email}</Text>
          </View>
        ) : (
          <View style={styles.settingItem}>
            <Text>User: Not signed in</Text>
          </View>
        )}
      </View> */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => router.push('/(auth)/signin')}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: '#4A6FA5', fontWeight: '500' }}>Go to Login By force</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Extras</Text>
        <View style={styles.tabsContainer}>
          <TabButton
            icon="bulb"
            label="Tips"
            active={activeTab === 'tips'}
            onPress={() => setActiveTab('tips')}
          />
          <TabButton
            icon="notifications"
            label="Notifications"
            active={activeTab === 'notifications'}
            onPress={() => setActiveTab('notifications')}
            badge={notifications.filter(n => !n.read).length}
          />
          <TabButton
            icon="settings"
            label="Settings"
            active={activeTab === 'settings'}
            onPress={() => setActiveTab('settings')}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'tips' && renderTipsTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const TabButton = ({
  icon,
  label,
  active,
  onPress,
  badge
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
  badge?: number;
}) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.activeTabButton]}
    onPress={onPress}
  >
    <Ionicons
      name={icon as any}
      size={20}
      color={active ? '#4A6FA5' : '#6B7280'}
    />
    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    {badge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

const NotificationItem = ({
  notification,
  onPress
}: {
  notification: Notification;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
    onPress={onPress}
  >
    <View style={styles.notificationIconContainer}>
      <Ionicons
        name={
          notification.type === 'material' ? 'document-text' :
            notification.type === 'reminder' ? 'alarm' : 'book'
        }
        size={20}
        color="#4A6FA5"
      />
    </View>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{notification.title}</Text>
      <Text style={styles.notificationMessage}>{notification.message}</Text>
      <Text style={styles.notificationTime}>{notification.time}</Text>
    </View>
    {!notification.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

const SettingItem = ({
  icon,
  title,
  value,
  onPress
}: {
  icon: string;
  title: string;
  value?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon as any} size={24} color="#4A6FA5" style={styles.settingIcon} />
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <View style={styles.settingRight}>
      {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#F8FAFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A202C',
    marginBottom: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1,
    borderRadius: 8,
    margin: 2,
  },
  activeTabButton: {
    backgroundColor: '#F0F4FF',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 16,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Tips Tab Styles
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#4A6FA5',
  },
  categoryText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  tipContent: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tipCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipCategoryText: {
    fontSize: 12,
    color: '#4A6FA5',
    marginLeft: 4,
    fontWeight: '500',
  },
  // Notifications Tab Styles
  notificationsContainer: {
    marginBottom: 24,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  markAllRead: {
    fontSize: 14,
    color: '#4A6FA5',
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#F8FAFF',
    borderLeftWidth: 3,
    borderLeftColor: '#4A6FA5',
    paddingLeft: 13,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A6FA5',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  // Settings Tab Styles
  settingsContainer: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1F2937',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 8,
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
