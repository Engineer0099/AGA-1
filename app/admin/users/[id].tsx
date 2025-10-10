import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  joinedDate: string;
  totalUploads: number;
  lastLogin: string;
  bio?: string;
};

const UserDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock user data
        const mockUser: User = {
          id: id || '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'student',
          status: 'active',
          lastActive: '2 hours ago',
          joinedDate: '2023-01-15',
          totalUploads: 24,
          lastLogin: '2023-10-25T14:30:00Z',
          bio: 'Active student in the Computer Science department.'
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    setEditing(!editing);
    // In a real app, this would open an edit form
  };

  const handleStatusChange = (newStatus: 'active' | 'inactive' | 'suspended') => {
    if (user) {
      setUser({ ...user, status: newStatus });
      // In a real app, this would call an API to update the status
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'suspended': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#4F46E5';
      case 'teacher': return '#10B981';
      case 'student': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'User Details',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#4A6FA5',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setEditing(!editing)}
              style={{ marginRight: 16 }}
            >
              <Ionicons 
                name={editing ? 'close' : 'pencil'} 
                size={22} 
                color="#4A6FA5" 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#9CA3AF" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <InfoRow label="Email" value={user.email} icon="mail-outline" />
          <InfoRow 
            label="Role" 
            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
            icon="person-outline"
            valueStyle={{ color: getRoleColor(user.role) }}
          />
          <InfoRow label="Member since" value={new Date(user.joinedDate).toLocaleDateString()} icon="calendar-outline" />
          <InfoRow label="Last active" value={user.lastActive} icon="time-outline" />
          <InfoRow label="Total uploads" value={user.totalUploads.toString()} icon="cloud-upload-outline" />
        </View>

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="key-outline" size={20} color="#4A6FA5" />
            <Text style={styles.actionButtonText}>Reset Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={20} color="#4A6FA5" />
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
          
          {user.status !== 'suspended' ? (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#FEE2E2' }]}
              onPress={() => handleStatusChange('suspended')}
            >
              <Ionicons name="ban-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Suspend User</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#D1FAE5' }]}
              onPress={() => handleStatusChange('active')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Activate User</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* User Activity (Placeholder) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.placeholderBox}>
            <Ionicons name="time-outline" size={24} color="#9CA3AF" />
            <Text style={styles.placeholderText}>User activity will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable InfoRow component
const InfoRow = ({ 
  label, 
  value, 
  icon,
  valueStyle = {}
}: { 
  label: string; 
  value: string; 
  icon: keyof typeof Ionicons.glyphMap;
  valueStyle?: object;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabel}>
      <Ionicons name={icon} size={18} color="#6B7280" style={styles.infoIcon} />
      <Text style={styles.infoLabelText}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
  </View>
);

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
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A6FA5',
  },
  placeholderBox: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default UserDetailScreen;
