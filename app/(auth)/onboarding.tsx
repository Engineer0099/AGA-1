import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

type SchoolLevel = 'primary' | 'secondary' | 'university';

const LEVELS = [
  { id: 'primary', name: 'Primary School' },
  { id: 'secondary', name: 'Secondary School' },
  { id: 'university', name: 'University/College' },
];

export default function OnboardingScreen() {
  const [selectedLevel, setSelectedLevel] = useState<SchoolLevel | null>(null);

  const handleContinue = () => {
    if (selectedLevel) {
      // Navigate to signup with selected level
      router.push({
        pathname: '/(auth)/signup',
        params: { level: selectedLevel }
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Select Your Education Level</Text>
        <Text style={styles.subtitle}>Choose the level you're currently in or preparing for</Text>
        
        <View style={styles.levelsContainer}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel === level.id && styles.levelCardSelected
              ]}
              onPress={() => setSelectedLevel(level.id as SchoolLevel)}
            >
              <Text style={[
                styles.levelText,
                selectedLevel === level.id && styles.levelTextSelected
              ]}>
                {level.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLevel && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedLevel}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  levelsContainer: {
    marginTop: 20,
  },
  levelCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  levelCardSelected: {
    backgroundColor: '#F0F4FF',
    borderColor: '#4A6FA5',
  },
  levelText: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
  },
  levelTextSelected: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
