import { fetchDocumentById, updateDocumentById } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  active: 'true' | 'false' ;
  lastActive: string;
  $createdAt: string;
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

  const loadUserByIdFromDB = async () => {
    try{
        const loadedPaper = await fetchDocumentById(
        '68ca66480039a017b799',
        'user',
        id as string
      )
      return loadedPaper;
    }catch(error){
      console.error('Error Loading Paper from Database', error)
      return []
    }
    
  };
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await loadUserByIdFromDB() as any;
        console.log('Fetched user:', user);
        
        setUser(user);
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


  // const handleEdit = () => {
  //   setEditing(!editing);
  //   // In a real app, this would open an edit form
  // };

  const handleStatusChange = async (newStatus: 'true' | 'false') => {
    const status = newStatus === 'true' ? true : false;
    if (user) {
      try {
        setLoading(true);
        const updatedStatus = await updateDocumentById(
          '68ca66480039a017b799',
          'user',
          id as string,
          { active: status }
        );
        setUser(updatedStatus as any);
        setUser({ ...user, active: newStatus });
        Alert.alert('Success', `User status updated to ${newStatus === 'true' ? 'Active' : 'Suspended'}`);
      } catch (error) {
        console.error('Error updating user status:', error);
        Alert.alert('Error', 'Failed to update user status. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const changeUserRole = async (newRole: 'admin' | 'student') => {
    if (user) {
      try {
        setLoading(true);
        const updatedUser = await updateDocumentById(
          '68ca66480039a017b799',
          'user',
          id as string,
          { role: newRole }
        );
        setUser(updatedUser as any);
        setUser({ ...user, role: newRole });
        Alert.alert('Success', `User role updated to ${newRole}`);
      } catch (error) {
        console.error('Error updating user role:', error);
        Alert.alert('Error', 'Failed to update user role. Please try again.');
      } finally {
        setLoading(false);
      }
      
    }
  };

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return '#10B981'; // Green for active
      case false: return '#EF4444'; // Red for suspended
      default: return '#9CA3AF'; // Gray for unknown
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#4F46E5';
      case 'student': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading User...</Text>
        <ActivityIndicator size="large" color="#4A6FA5" />
      </View>
    );
  }

  

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <TouchableOpacity onPress={handleBack} style={{ marginTop: 20 }}>
          <Text style={{ color: '#4A6FA5' }}>Go Back</Text>
        </TouchableOpacity>
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
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.active ? true : false) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.active ? true : false) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(user.active ? true : false) }]}>
              {user.active ? 'Active' : 'Suspended'}
            </Text>
          </View>
        </View>

        

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <InfoRow label="Email" value={user.email} icon="mail-outline" />
          <InfoRow 
            label="Role" 
            value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} 
            icon="person-outline"
            valueStyle={{ color: getRoleColor(user.role) }}
          />
          <InfoRow label="Member since" value={new Date(user.$createdAt)?.toLocaleDateString()} icon="calendar-outline" />
          {/* <InfoRow label="Last active" value={user.lastActive} icon="time-outline" /> */}
          {
            user.role === 'admin' && (
              <InfoRow label="Total uploads" value={user.totalUploads?.toString() || "00"} icon="cloud-upload-outline" />
            )
          }
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
          
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="key-outline" size={20} color="#4A6FA5" />
            <Text style={styles.actionButtonText}>Reset Password</Text>
          </TouchableOpacity> */}
          
          {/* <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail-outline" size={20} color="#4A6FA5" />
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity> */}

          {/* button to make or remove admin */}
          <TouchableOpacity>
            {user.role !== 'admin' ? (
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#DBEAFE' }]}
                onPress={() => Alert.alert(
                  'Confirm Role Change',
                  `Are you sure you want to make ${user.name} an admin?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Make Admin', onPress: () => {
                      changeUserRole('admin');
                      Alert.alert('Success', `${user.name} is now an admin.`);
                    }, style: 'destructive' }
                  ]
                )}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color="#4F46E5" />
                <Text style={[styles.actionButtonText, { color: '#4F46E5' }]}>Make Admin</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, { borderColor: '#FEE2E2' }]}
                onPress={() => Alert.alert(
                  'Confirm Role Change',
                  `Are you sure you want to remove admin rights from ${user.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Remove Admin', onPress: () => {
                      changeUserRole('student');
                      Alert.alert('Success', `${user.name} is no longer an admin.`);
                    }, style: 'destructive' }
                  ]
                )}
              >
                <Ionicons name="shield-outline" size={20} color="#EF4444" />
                <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Remove Admin</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          
          {user.active ? (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#FEE2E2' }]}
              onPress={() => handleStatusChange('false')}
            >
              <Ionicons name="ban-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Suspend User</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#D1FAE5' }]}
              onPress={() => handleStatusChange('true')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Activate User</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* User Activity (Placeholder) */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.placeholderBox}>
            <Ionicons name="time-outline" size={24} color="#9CA3AF" />
            <Text style={styles.placeholderText}>User activity will appear here</Text>
          </View>
        </View> */}
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
