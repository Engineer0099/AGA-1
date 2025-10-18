import { useUser } from '@/hooks/useUser';
import { databases } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  active: true | false;
  lastActive: string;
};

const UsersScreen = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };

  const isOnline = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  };


  // Load users from local storage
  const loadCachedUsers = async () => {
    try {
      const cached = await AsyncStorage.getItem('users');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error loading cached users', error);
      return [];
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController(); // kept in case you want to wire up real abort logic later
    const fetchUsers = async () => {
      setLoading(true);
      const online = await isOnline();
      try {
        if(online){
          const res = await databases.listDocuments("68ca66480039a017b799", "user");
          // Save to local storage
          await AsyncStorage.setItem('users', JSON.stringify(res.documents));

          if (!mounted) return;
  
          const docs = Array.isArray((res as any).documents) ? (res as any).documents : [];
          // Map Appwrite documents to your local User type; adjust field names to match your collection
          const mapped: User[] = docs.map((d: any) => ({
            id: d.$id ?? d.id,
            name: d.name ?? (`${d.firstName ?? ''} ${d.lastName ?? ''}`.trim() || d.email || 'Unnamed'),
            email: d.email ?? '',
            role: (d.role as User['role']) ?? 'student',
            active: (d.active as User['active']) ?? false,
            lastActive: d.lastActive ?? d.updatedAt ?? d.$updatedAt ?? 'Unknown',
          }));
  
          setUsers(mapped);
        } else {
          const cachedUsers = await loadCachedUsers();
          if (!mounted) return;
          setUsers(cachedUsers);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching users from Appwrite', err);
        setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  // const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/(tabs)/library');
    }
  }, [user, router]);

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return '#10B981';
      case false: return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    // const matchesStatus = !selectedStatus || user.active === selectedStatus;
    return matchesSearch && matchesRole ;
  });

  const handleUserPress = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleAddUser = () => {
    router.push('/admin/users/new');
  };

  const timeAgo = (timestamp: string | number | Date) => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={40} color="#9CA3AF" />
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.active) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.active) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.active) }]}>
              {item.active ? 'Active' : 'Suspended'}
            </Text>
          </View>
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Text>
          </View>
          <Text style={styles.lastActive}>
          {timeAgo(item.lastActive)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
    </TouchableOpacity>
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#4F46E5';
      case 'student': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { position: 'relative' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddUser}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
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
            style={[styles.filterPill, !selectedRole && styles.filterPillActive]}
            onPress={() => setSelectedRole(null)}
          >
            <Text style={[styles.filterText, !selectedRole && styles.filterTextActive]}>All Roles</Text>
          </TouchableOpacity>
          {['admin', 'student'].map(role => (
            <TouchableOpacity 
              key={role}
              style={[styles.filterPill, selectedRole === role && styles.filterPillActive]}
              onPress={() => setSelectedRole(role === selectedRole ? null : role)}
            >
              <Text style={[styles.filterText, selectedRole === role && styles.filterTextActive]}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A6FA5" />
          <Text style={{ color: '#6B7280' }}>Loading users...</Text>
        </View>
        ) : (
        <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
      )}
      
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddUser}
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
    marginBottom: 16,
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
  },
  filtersScroll: {
    paddingHorizontal: 20,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 14,
  },
  userList: {
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actionButton: {
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

export default UsersScreen;
