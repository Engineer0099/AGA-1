import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ContentType = 'notes' | 'qna';
type ScreenType = 'levels' | 'grades' | 'subjects' | 'topics' | 'materials' | 'pastPapers' | 'questions';

interface NavigationState {
  screen: ScreenType;
  title: string;
  data: any;
}

interface Grade {
  id: string;
  name: string;
  subjects: Subject[];
}

type EducationLevelType = 'pre-school' | 'primary' | 'secondary' | 'advanced' | 'university';

interface EducationLevel {
  id: EducationLevelType;
  name: string;
  grades?: Grade[];
  subjects?: Subject[];
}

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer';
  options?: string[];
  answer: string;
}

interface PastPaper {
  id: string;
  year: number;
  title: string;
  questions: Question[];
}

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
  pastPapers?: PastPaper[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  materials: Material[];
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'quiz';
  duration?: string;
  questions?: number;
}

// Mock data for education levels, grades, and subjects
const EDUCATION_DATA: EducationLevel[] = [
  {
    id: 'pre-school',
    name: 'Pre-school',
    subjects: [
      {
        id: 'alphabet',
        name: 'Alphabet & Numbers',
        topics: [
          {
            id: 'letters',
            title: 'Learning Letters',
            description: 'Introduction to the alphabet',
            materials: [
              { id: 'ps1', title: 'A to Z Song', type: 'video', duration: '5 min' },
              { id: 'ps2', title: 'Letter Tracing', type: 'pdf' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'primary',
    name: 'Primary School',
    grades: Array.from({ length: 7 }, (_, i) => ({
      id: `std-${i + 1}`,
      name: `Standard ${i + 1}`,
      subjects: [
        { id: 'math', name: 'Mathematics', topics: [] },
        { id: 'english', name: 'English', topics: [] },
        { id: 'kiswahili', name: 'Kiswahili', topics: [] },
        { id: 'science', name: 'Science', topics: [] },
      ],
    })),
  },
  {
    id: 'secondary',
    name: 'Secondary School',
    grades: Array.from({ length: 4 }, (_, i) => ({
      id: `form-${i + 1}`,
      name: `Form ${i + 1}`,
      subjects: [
        { id: 'physics', name: 'Physics', topics: [] },
        { id: 'chemistry', name: 'Chemistry', topics: [] },
        { id: 'biology', name: 'Biology', topics: [] },
        { id: 'history', name: 'History', topics: [] },
      ],
    })),
  },
  {
    id: 'advanced',
    name: 'Advanced Level',
    grades: Array.from({ length: 2 }, (_, i) => ({
      id: `form-${i + 5}`,
      name: `Form ${i + 5}`,
      subjects: [
        { id: 'advanced-math', name: 'Advanced Mathematics', topics: [] },
        { id: 'economics', name: 'Economics', topics: [] },
        { id: 'geography', name: 'Geography', topics: [] },
      ],
    })),
  },
  {
    id: 'university',
    name: 'University',
    subjects: [
      {
        id: 'computer-science',
        name: 'Computer Science',
        topics: [
          {
            id: 'algorithms',
            title: 'Algorithms',
            description: 'Introduction to algorithm design',
            materials: [
              { id: 'u1', title: 'Sorting Algorithms', type: 'pdf' },
            ],
          },
        ],
      },
    ],
  },
];

// const SUBJECTS: Record<string, Subject[]> = {
//   'pre-school': [
//     {
//       id: 'alphabet',
//       name: 'Alphabet & Numbers',
//       topics: [
//         {
//           id: 'letters',
//           title: 'Learning Letters',
//           description: 'Introduction to the alphabet',
//           materials: [
//             { id: 'ps1', title: 'A to Z Song', type: 'video', duration: '5 min' },
//             { id: 'ps2', title: 'Letter Tracing', type: 'pdf' },
//           ],
//         },
//         {
//           id: 'counting',
//           title: 'Counting 1-20',
//           description: 'Learn to count numbers',
//           materials: [
//             { id: 'ps3', title: 'Number Song', type: 'video', duration: '3 min' },
//             { id: 'ps4', title: 'Number Worksheets', type: 'pdf' },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'shapes',
//       name: 'Shapes & Colors',
//       topics: [
//         {
//           id: 'basic-shapes',
//           title: 'Basic Shapes',
//           description: 'Learn about circles, squares, and more',
//           materials: [
//             { id: 'ps5', title: 'Shapes Song', type: 'video', duration: '4 min' },
//             { id: 'ps6', title: 'Shape Matching Game', type: 'pdf' },
//           ],
//         },
//       ],
//     },
//   ],
//   'primary': [
//     {
//       id: 'math',
//       name: 'Mathematics',
//       topics: [
//         {
//           id: 'fractions',
//           title: 'Fractions',
//           description: 'Learn about fractions and their operations',
//           materials: [
//             { id: 'p1', title: 'Introduction to Fractions', type: 'pdf' },
//             { id: 'p2', title: 'Adding Fractions', type: 'video', duration: '10 min' },
//             { id: 'p3', title: 'Fractions Quiz', type: 'quiz', questions: 10 },
//           ],
//         },
//         {
//           id: 'multiplication',
//           title: 'Multiplication',
//           description: 'Master multiplication tables',
//           materials: [
//             { id: 'p4', title: 'Times Tables Guide', type: 'pdf' },
//             { id: 'p5', title: 'Multiplication Practice', type: 'quiz', questions: 15 },
//           ],
//         },
//       ],
//       pastPapers: [
//         {
//           id: 'math-2023',
//           year: 2023,
//           title: 'Primary School Leaving Examination',
//           questions: [
//             { id: 'q1', type: 'multiple-choice', text: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
//             { id: 'q2', type: 'short-answer', text: 'What is 10 * 5?', answer: '50' },
//           ],
//         },
//         {
//           id: 'math-2022',
//           year: 2022,
//           title: 'Primary School Leaving Examination',
//           questions: [
//             { id: 'q1', type: 'multiple-choice', text: 'What is 3 * 3?', options: ['6', '9', '12'], answer: '9' },
//           ],
//         },
//       ]
//     },
//     {
//       id: 'english',
//       name: 'English',
//       topics: [
//         {
//           id: 'grammar',
//           title: 'Grammar Basics',
//           description: 'Introduction to English grammar',
//           materials: [
//             { id: 'p6', title: 'Parts of Speech', type: 'pdf' },
//             { id: 'p7', title: 'Tenses Explained', type: 'video', duration: '12 min' },
//           ],
//         },
//         {
//           id: 'reading',
//           title: 'Reading Comprehension',
//           description: 'Practice reading and understanding texts',
//           materials: [
//             { id: 'p8', title: 'Short Stories', type: 'pdf' },
//             { id: 'p9', title: 'Comprehension Questions', type: 'quiz', questions: 8 },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'science',
//       name: 'Science',
//       topics: [
//         {
//           id: 'plants',
//           title: 'Plants and Animals',
//           description: 'Learn about living things',
//           materials: [
//             { id: 'p10', title: 'Plant Life Cycle', type: 'video', duration: '8 min' },
//             { id: 'p11', title: 'Animal Habitats', type: 'pdf' },
//           ],
//         },
//       ],
//     },
//   ],
//   'secondary': [
//     {
//       id: 'physics',
//       name: 'Physics',
//       topics: [
//         {
//           id: 'motion',
//           title: 'Motion and Forces',
//           description: 'Understanding movement and forces',
//           materials: [
//             { id: 's1', title: 'Laws of Motion', type: 'pdf' },
//             { id: 's2', title: 'Force Calculations', type: 'video', duration: '15 min' },
//             { id: 's3', title: 'Forces Quiz', type: 'quiz', questions: 12 },
//           ],
//         },
//       ],
//       pastPapers: [
//         {
//           id: 'phy-2023',
//           year: 2023,
//           title: 'Form 4 National Examination',
//           questions: [
//             { id: 'q1', text: 'Define velocity.', type: 'short-answer', answer: 'The rate of change of displacement.' },
//             { id: 'q2', text: 'What is the formula for force?', type: 'multiple-choice', options: ['F=ma', 'E=mc^2', 'a^2+b^2=c^2'], answer: 'F=ma' },
//           ],
//         },
//       ]
//     },
//     {
//       id: 'chemistry',
//       name: 'Chemistry',
//       topics: [
//         {
//           id: 'periodic-table',
//           title: 'Periodic Table',
//           description: 'Understanding elements and their properties',
//           materials: [
//             { id: 's4', title: 'Element Groups', type: 'pdf' },
//             { id: 's5', title: 'Chemical Reactions', type: 'video', duration: '18 min' },
//           ],
//         },
//       ],
//     },
//   ],
//   'advanced': [
//     {
//       id: 'advanced-math',
//       name: 'Advanced Mathematics',
//       topics: [
//         {
//           id: 'calculus',
//           title: 'Calculus',
//           description: 'Introduction to differentiation and integration',
//           materials: [
//             { id: 'a1', title: 'Derivatives Guide', type: 'pdf' },
//             { id: 'a2', title: 'Integration Techniques', type: 'video', duration: '20 min' },
//             { id: 'a3', title: 'Calculus Problems', type: 'quiz', questions: 15 },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'biology',
//       name: 'Biology',
//       topics: [
//         {
//           id: 'genetics',
//           title: 'Genetics',
//           description: 'Study of genes and heredity',
//           materials: [
//             { id: 'a4', title: 'Mendelian Genetics', type: 'pdf' },
//             { id: 'a5', title: 'DNA Replication', type: 'video', duration: '14 min' },
//           ],
//         },
//       ],
//     },
//   ],
//   'university': [
//     {
//       id: 'computer-science',
//       name: 'Computer Science',
//       topics: [
//         {
//           id: 'algorithms',
//           title: 'Algorithms',
//           description: 'Introduction to algorithm design',
//           materials: [
//             { id: 'u1', title: 'Sorting Algorithms', type: 'pdf' },
//             { id: 'u2', title: 'Big O Notation', type: 'video', duration: '25 min' },
//             { id: 'u3', title: 'Algorithm Challenges', type: 'quiz', questions: 10 },
//           ],
//         },
//       ],
//     },
//     {
//       id: 'business',
//       name: 'Business Administration',
//       topics: [
//         {
//           id: 'marketing',
//           title: 'Marketing Principles',
//           description: 'Fundamentals of marketing strategies',
//           materials: [
//             { id: 'u4', title: 'Marketing Mix', type: 'pdf' },
//             { id: 'u5', title: 'Digital Marketing', type: 'video', duration: '22 min' },
//           ],
//         },
//       ],
//     },
//   ],
// };

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ContentType>('notes');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([
    { screen: 'levels', title: 'Education Level', data: null },
  ]);

  const currentScreen = navigationStack[navigationStack.length - 1];

  const navigateTo = (screen: NavigationState) => {
    setShowAnswers(false); // Reset answer visibility on navigation
    setUserAnswers({}); // Reset answers when navigating to a new screen
    setNavigationStack([...navigationStack, screen]);
  };

  const goBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(navigationStack.slice(0, -1));
    }
  };

  const renderLevels = () => (
    <View style={styles.grid}>
      {EDUCATION_DATA.map((level) => (
        <TouchableOpacity
          key={level.id}
          style={styles.card}
          onPress={() => {
            if (level.grades) {
              navigateTo({
                screen: 'grades',
                title: 'Select Grade',
                data: { levelId: level.id },
              });
            } else if (level.subjects) {
              navigateTo({
                screen: 'subjects',
                title: 'Select Subject',
                data: { levelId: level.id },
              });
            }
          }}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="school-outline" size={24} color="#4A6FA5" />
          </View>
          <Text style={styles.cardText}>{level.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderGrades = () => {
    const { levelId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    const grades = level?.grades || [];

    return (
      <View style={styles.grid}>
        {grades.map((grade) => (
          <TouchableOpacity
            key={grade.id}
            style={styles.card}
            onPress={() => {
              navigateTo({
                screen: 'subjects',
                title: 'Select Subject',
                data: { ...currentScreen.data, gradeId: grade.id },
              });
            }}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="library-outline" size={24} color="#4A6FA5" />
            </View>
            <Text style={styles.cardText}>{grade.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSubjects = () => {
    const { levelId, gradeId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    let subjects: Subject[] = [];
    if (gradeId) {
      subjects = level?.grades?.find(g => g.id === gradeId)?.subjects || [];
    } else {
      subjects = level?.subjects || [];
    }
    
    return (
      <View style={styles.list}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            style={styles.listItem}
            onPress={() => {
              if (activeTab === 'notes') {
                if (subject.topics && subject.topics.length > 0) {
                  navigateTo({
                    screen: 'topics',
                    title: subject.name,
                    data: { ...currentScreen.data, subjectId: subject.id, subjectName: subject.name },
                  });
                } else {
                  alert('No topics available for this subject yet.');
                }
              } else { // Q&A tab is active
                navigateTo({
                  screen: 'pastPapers',
                  title: `${subject.name} - Q&A`,
                  data: { ...currentScreen.data, subjectId: subject.id, subjectName: subject.name },
                });
              }
            }}
          >
            <View style={styles.listItemIcon}>
              <Ionicons name="book-outline" size={20} color="#4A6FA5" />
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{subject.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTopics = () => {
    const { levelId, gradeId, subjectId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    let subject: Subject | undefined;
    if (gradeId) {
      subject = level?.grades?.find(g => g.id === gradeId)?.subjects.find(s => s.id === subjectId);
    } else {
      subject = level?.subjects?.find(s => s.id === subjectId);
    }
    const topics = subject?.topics || [];
    
    return (
      <View style={styles.list}>
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.listItem}
            onPress={() => {
              if (topic.materials && topic.materials.length > 0) {
                navigateTo({
                  screen: 'materials',
                  title: topic.title,
                  data: { ...currentScreen.data, topicId: topic.id, topicTitle: topic.title },
                });
              } else {
                // If no materials, show a message
                alert('No materials available for this topic yet.');
              }
            }}
          >
            <View style={styles.listItemIcon}>
              <Ionicons name="document-text-outline" size={20} color="#4A6FA5" />
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{topic.title}</Text>
              <Text style={styles.listItemSubtitle} numberOfLines={1}>
                {topic.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMaterials = () => {
    const { levelId, gradeId, subjectId, topicId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    let subject: Subject | undefined;
    if (gradeId) {
      subject = level?.grades?.find(g => g.id === gradeId)?.subjects.find(s => s.id === subjectId);
    } else {
      subject = level?.subjects?.find(s => s.id === subjectId);
    }
    const topic = subject?.topics?.find(t => t.id === topicId);
    const materials = topic?.materials || [];

    return (
      <View style={styles.list}>
        {materials.map((material) => (
          <TouchableOpacity key={material.id} style={styles.listItem}>
            <View style={styles.listItemIcon}>
              <Ionicons
                name={
                  material.type === 'pdf'
                    ? 'document-text-outline'
                    : material.type === 'video'
                    ? 'play-circle-outline'
                    : 'help-circle-outline'
                }
                size={20}
                color="#4A6FA5"
              />
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{material.title}</Text>
              {material.duration && (
                <Text style={styles.listItemSubtitle}>
                  {material.duration}
                </Text>
              )}
            </View>
            <Ionicons name="download-outline" size={20} color="#4A6FA5" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPastPapers = () => {
    const { levelId, gradeId, subjectId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    let subject: Subject | undefined;
    if (gradeId) {
      subject = level?.grades?.find(g => g.id === gradeId)?.subjects.find(s => s.id === subjectId);
    } else {
      subject = level?.subjects?.find(s => s.id === subjectId);
    }
    const pastPapers = subject?.pastPapers || [];

    if (pastPapers.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No past papers available for this subject yet.</Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {pastPapers.map((paper) => (
          <TouchableOpacity 
            key={paper.id} 
            style={styles.listItem}
            onPress={() => navigateTo({
              screen: 'questions',
              title: `${paper.year} Paper`,
              data: { ...currentScreen.data, paperId: paper.id },
            })}
          >
            <View style={styles.listItemIcon}>
              <Ionicons name="document-attach-outline" size={20} color="#4A6FA5" />
            </View>
            <View style={styles.listItemText}>
              <Text style={styles.listItemTitle}>{`${paper.title} - ${paper.year}`}</Text>
              <Text style={styles.listItemSubtitle}>{`${paper.questions.length} questions`}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderQuestions = () => {
    const { levelId, gradeId, subjectId, paperId } = currentScreen.data;
    const level = EDUCATION_DATA.find(l => l.id === levelId);
    let subject: Subject | undefined;
    if (gradeId) {
      subject = level?.grades?.find(g => g.id === gradeId)?.subjects.find(s => s.id === subjectId);
    } else {
      subject = level?.subjects?.find(s => s.id === subjectId);
    }
    const paper = subject?.pastPapers?.find(p => p.id === paperId);
    const questions = paper?.questions || [];

    const handleSelectOption = (questionId: string, option: string) => {
      setUserAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    return (
      <ScrollView>
        {questions.map((q, index) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{`${index + 1}. ${q.text}`}</Text>
            {q.type === 'multiple-choice' && q.options?.map(option => {
              const isSelected = userAnswers[q.id] === option;
              const isCorrect = q.answer === option;

              return (
                <TouchableOpacity 
                  key={option} 
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    showAnswers && isCorrect && styles.correctOption,
                    showAnswers && isSelected && !isCorrect && styles.incorrectOption,
                  ]}
                  onPress={() => !showAnswers && handleSelectOption(q.id, option)}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    showAnswers && isCorrect && styles.correctOptionText,
                    showAnswers && isSelected && !isCorrect && styles.incorrectOptionText,
                  ]}>{option}</Text>
                </TouchableOpacity>
              )
            })}
            {q.type === 'short-answer' && showAnswers && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Correct Answer:</Text>
                <Text style={styles.answerText}>{q.answer}</Text>
              </View>
            )}
                      </View>
        ))}
        {!showAnswers && questions.length > 0 && (
          <TouchableOpacity style={styles.checkButton} onPress={() => setShowAnswers(true)}>
            <Text style={styles.checkButtonText}>Check Answers</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (currentScreen.screen) {
      case 'grades':
        return renderGrades();
      case 'subjects':
        return renderSubjects();
      case 'topics':
        return renderTopics();
      case 'materials':
        return renderMaterials();
      case 'pastPapers':
        return renderPastPapers();
      case 'questions':
        return renderQuestions();
      case 'levels':
      default:
        return renderLevels();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {navigationStack.length > 1 ? (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentScreen.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'qna' && styles.activeTab]}
          onPress={() => setActiveTab('qna')}
        >
          <Text style={[styles.tabText, activeTab === 'qna' && styles.activeTabText]}>
            Q&A
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderContent()}
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
