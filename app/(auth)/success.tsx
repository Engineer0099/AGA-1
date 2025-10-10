import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SchoolLevel = 'primary' | 'secondary' | 'university';

export default function SuccessScreen() {
  const { level } = useLocalSearchParams<{ level: SchoolLevel }>();

  const getLevelName = () => {
    switch (level) {
      case 'primary':
        return 'Primary School';
      case 'secondary':
        return 'Secondary School';
      case 'university':
        return 'University/College';
      default:
        return 'Education';
    }
  };

  const handleGetStarted = () => {
    // Navigate to the main app
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <MaterialIcons name="check" size={48} color="#4CAF50" />
          </View>
        </View>
        
        <Text style={styles.title}>Subscription Successful!</Text>
        
        <Text style={styles.message}>
          You now have full access to {getLevelName()} materials.
        </Text>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan:</Text>
            <Text style={styles.detailValue}>Premium {getLevelName()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          You can manage your subscription in the app settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});
