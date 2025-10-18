import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function LibraryScreen() {
  const { user } = useUser();


  const navigateTo = (screen: any) => {
    router.push(screen);
  };
  
  const EducationLevel = [
    "Pre-School",
    "Primary School",
    "Secondary School",
    "Advanced Level",
    "University",
  ];

  const Level: React.FC<{ one: string }> = ({ one }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={async() => {
            if(one === "Pre-School" || one === "University"){
              await AsyncStorage.setItem('current_grade', one.toLowerCase());
              navigateTo('/admin/subjects');
            }else{
              await AsyncStorage.setItem('current_level', one);
              navigateTo('/library/GradeScreen');
            }
          }}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="school-outline" size={24} color="#4A6FA5" />
          </View>
          <Text style={styles.cardText}>{one}</Text>
        </TouchableOpacity>
    );
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.container}>
          <Text style={{fontSize: 20}}>Hellow!,</Text>
          <Text style={{fontSize: 16}}>{user?.name || "Student"}</Text>
        </View>
        <TouchableOpacity
         style={{}}
         onPress={() => navigateTo('/admin/profile')}
        >
          <Ionicons name='person-circle-outline' size={45} color={'blue'} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.grid} >
          {EducationLevel.map((l) => (
            <Level key={l} one={l}/>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  headerSpacer: {
    width: 40,
  },
  backButton: {
    padding: 4,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    margin: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
  list: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 15,
    color: '#334155',
  },
  selectedOptionText: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  correctOption: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  correctOptionText: {
    color: '#065F46',
    fontWeight: '600',
  },
  incorrectOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  incorrectOptionText: {
    color: '#991B1B',
    fontWeight: '600',
  },
  answerContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  answerText: {
    fontSize: 15,
    color: '#1F2937',
    marginTop: 4,
  },
  checkButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
