import { useUser } from "@/hooks/useUser";
import { account } from "@/lib/appwrite";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const AdminDashboard = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
        setLoading(true);
      try {
        await SecureStore.deleteItemAsync('admin_token');
        await account.deleteSession('current');
        setUser(null);
        router.replace('/(auth)/signin');
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
};
    

    if (loading) {
        return (
        <SafeAreaView style={ { flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.sectionTitle}>Logging out...</Text>
        </SafeAreaView>
        );
   } else if (!user) {
        return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{fontSize: 15}}>Loading...</Text>
        </View>
        );
   }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Ionicons name="person-circle-outline" size={100} color="#6d9bdbff" />
            <View style={{ alignItems: 'center', marginTop: 8 }}>
                <Text style={styles.adminName}>{user.name || 'Admin'}</Text>
                <Text style={styles.welcomeText}>{user.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                <TouchableOpacity style={styles.editButton} onPress={() => router.push('/admin/profile/edit')}>
                    <Ionicons name="create-outline" size={18} color="#2563EB" />
                    <Text style={styles.logoutButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={18} color="#2563EB" />
                    <Text style={styles.logoutButtonText}>Logout</Text> 
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{user?.name || 'N/A'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Role:</Text>
                <Text style={styles.value}>{user?.role || 'N/A'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{user?.phone || 'N/A'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.value}>{user?.bio || 'No Bio Yet'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Plan:</Text>
                <Text style={styles.value}>{user?.plan || 'Free'}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Plan Expiry:</Text>
                <Text style={styles.value}>{user?.plan_expiry ? new Date(user.plan_expiry).toLocaleDateString() : 'DD/MM/YYYY'}</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
    header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6B7280',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
    backButton: {
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
    scrollContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
    label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
    },
    value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    },
    logoutButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 4,
    color: '#2563EB',
    fontWeight: '500',
  },

}
);

export default AdminDashboard;