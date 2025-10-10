import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
};

const AdminLayout = ({ children, title, showBackButton = false }: AdminLayoutProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('admin_token');
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>{title}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default AdminLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1e40af',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  adminName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutText: {
    color: '#ffffff',
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
