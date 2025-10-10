import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Chip, useTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for subjects and materials
const SUBJECTS = [
  { id: 'math', name: 'Mathematics' },
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'english', name: 'English' },
  { id: 'kiswahili', name: 'Kiswahili' },
];

const MOCK_MATERIALS = [
  {
    id: '1',
    title: 'Algebra Basics',
    subject: 'math',
    type: 'notes',
    level: 'secondary',
    description: 'Introduction to algebraic expressions and equations',
    year: 2023,
    pages: 15,
    isDownloaded: false,
  },
  {
    id: '2',
    title: 'Physics Form 1 Notes',
    subject: 'physics',
    type: 'pdf',
    level: 'secondary',
    description: 'Comprehensive notes for Form 1 Physics',
    year: 2023,
    pages: 45,
    isDownloaded: true,
  },
  {
    id: '3',
    title: 'Chemistry Practical Guide',
    subject: 'chemistry',
    type: 'guide',
    level: 'secondary',
    description: 'Step by step guide for chemistry practicals',
    year: 2023,
    pages: 30,
    isDownloaded: false,
  },
];

type Material = typeof MOCK_MATERIALS[0];

const LibraryScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleDownload = (id: string) => {
    setMaterials(prevMaterials =>
      prevMaterials.map(material =>
        material.id === id
          ? { ...material, isDownloaded: !material.isDownloaded }
          : material
      )
    );
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Chip 
            style={styles.chip} 
            textStyle={styles.chipText}
          >
            {item.type.toUpperCase()}
          </Chip>
        </View>
        <Paragraph style={styles.description} numberOfLines={2}>
          {item.description}
        </Paragraph>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{item.year} • {item.pages} pages</Text>
          <Text style={styles.subjectText}>
            {SUBJECTS.find(s => s.id === item.subject)?.name}
          </Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => toggleDownload(item.id)}
          icon={item.isDownloaded ? 'check' : 'download'}
        >
          {item.isDownloaded ? 'Downloaded' : 'Download'}
        </Button>
        <Button mode="contained">View</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>Library</Title>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search materials..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
          />
        </View>
      </View>

      <View style={styles.subjectsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsScroll}
        >
          <Chip
            mode={!selectedSubject ? 'flat' : 'outlined'}
            onPress={() => setSelectedSubject(null)}
            style={!selectedSubject ? styles.activeChip : styles.inactiveChip}
            textStyle={!selectedSubject ? styles.activeChipText : styles.inactiveChipText}
          >
            All
          </Chip>
          {SUBJECTS.map(subject => (
            <Chip
              key={subject.id}
              mode={selectedSubject === subject.id ? 'flat' : 'outlined'}
              onPress={() => setSelectedSubject(
                selectedSubject === subject.id ? null : subject.id
              )}
              style={selectedSubject === subject.id ? styles.activeChip : styles.inactiveChip}
              textStyle={selectedSubject === subject.id ? styles.activeChipText : styles.inactiveChipText}
            >
              {subject.name}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="book-open-variant" 
              size={64} 
              color={theme.colors.onSurfaceDisabled}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceDisabled }]}>
              No materials found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 2,
  },
  subjectsContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subjectsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  activeChip: {
    marginRight: 8,
    backgroundColor: '#4A6FA5',
  },
  inactiveChip: {
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  activeChipText: {
    color: 'white',
  },
  inactiveChipText: {
    color: '#4A6FA5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    flex: 1,
    marginRight: 8,
  },
  chip: {
    height: 24,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 10,
    lineHeight: 20,
  },
  description: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A6FA5',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LibraryScreen;
