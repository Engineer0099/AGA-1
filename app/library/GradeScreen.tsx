import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GradeScreen = () => {
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState<string[]>([]);
    const [level, setLevel] = useState();
    const insets = useSafeAreaInsets();
    const { user } = useUser();

    
    const getGrades = (value: string) => {
        switch(value){
            case "Primary School":
                console.log(value);
                return["Standard 1", "Standard 2", "Standard 3", "Standard 4", "Standard 5", "Standard 6", "Standard 7",];
            case "Secondary School":
                return["Form 1", "Form 2", "Form 3", "Form 4"];
            case "Advanced Level":
                return["Form 5", "Form 6"];
            default:
                console.log(`Error Getting Grades"${value}"`);
                return;
        }
    }

    const getDbGrade = (value: string) => {
        console.log(value);
        switch(level as any){
            case "Primary School":
                return value.toLowerCase().replace(" ", "_");
            case "Secondary School":
                return value.toLowerCase().replace(" ", "-");
            case "Advanced Level":
                return value.toLowerCase().replace(" ", "-");
            default:
                console.log("Error Getting Db Grade");
                return;
        }
    }
    
    useEffect( () => {
        setLoading(true);
        (async() =>{
            try{
            const current_level = await AsyncStorage.getItem('current_level');
            let res = getGrades(current_level as string);
            setLevel(current_level as any)
            setGrades(res as any);
        } catch(err){
            console.log('Error Fetching Selected Level', err);
        } finally{
            setLoading(false);
        }
        })()
    }, []);


  const navigateTo = (screen: any) => {
    router.push(screen);
  };


  
  const Grade: React.FC<{ one: string }> = ({ one }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={
            async() => {
                let g = getDbGrade(one);
                console.log(g);
                await AsyncStorage.setItem('current_grade', g as any);
                navigateTo('/admin/subjects')
                }
            }
        >
          <View style={styles.cardIcon}>
            <Ionicons name="school-outline" size={24} color="#4A6FA5" />
          </View>
          <Text style={styles.cardText}>{one}</Text>
        </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#0558feff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Grade</Text>
            <View style={styles.headerSpacer} />
        </View>

      {/* Some inspiration words */}
        <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
                {user?.name ? `Welcome, ${user.name.split(' ')[0]}!` : 'Welcome!'}
            </Text>
            <Text style={styles.optionText}>
                Select a grade to view subjects, lessons and practice questions. Keep going — small steps lead to big progress.
            </Text>
        </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.grid} >
          {!loading ? (grades?.map((l) => (
            <Grade key={l} one={l}/>
          ))) : (
            <View style={styles.container}>
                <ActivityIndicator size={'large'} color={'blue'} />
                <Text>Loading...</Text>
            </View>
          )}
          
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


export default GradeScreen;