import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { Card, Title, Text, useTheme, Button, Divider, Chip, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for study tips and exam resources
const STUDY_TIPS = [
  {
    id: '1',
    title: 'Effective Note-Taking',
    category: 'Study Skills',
    duration: '5 min read',
    content: 'Learn how to take effective notes that help you remember information better and prepare for exams.',
    saved: true,
  },
  {
    id: '2',
    title: 'Time Management',
    category: 'Productivity',
    duration: '7 min read',
    content: 'Discover techniques to manage your study time effectively and avoid last-minute cramming.',
    saved: false,
  },
  {
    id: '3',
    title: 'Exam Preparation Guide',
    category: 'Exams',
    duration: '10 min read',
    content: 'A comprehensive guide to preparing for your exams, including study schedules and revision techniques.',
    saved: true,
  },
];

const EXAM_RESOURCES = [
  {
    id: '1',
    title: 'Past Papers 2023',
    subject: 'Mathematics',
    type: 'PDF',
    year: 2023,
    downloaded: true,
  },
  {
    id: '2',
    title: 'Physics Formulas',
    subject: 'Physics',
    type: 'Cheat Sheet',
    year: 2023,
    downloaded: false,
  },
  {
    id: '3',
    title: 'Chemistry Practical Guide',
    subject: 'Chemistry',
    type: 'Guide',
    year: 2023,
    downloaded: true,
  },
];

const ExtrasScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('tips');
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleSave = (id: string) => {
    // In a real app, this would update the saved status in your state/backend
    console.log(`Toggled save for item ${id}`);
  };

  const toggleDownload = (id: string) => {
    // In a real app, this would handle the download
    console.log(`Toggled download for item ${id}`);
  };

  const filteredTips = STUDY_TIPS.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = EXAM_RESOURCES.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudyTip = (tip: typeof STUDY_TIPS[0]) => (
    <Card key={tip.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Chip 
            mode="outlined" 
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {tip.category}
          </Chip>
          <Text style={[styles.duration, { color: theme.colors.onSurfaceVariant }]}>
            {tip.duration}
          </Text>
        </View>
        <Title style={styles.tipTitle}>{tip.title}</Title>
        <Text style={[styles.tipContent, { color: theme.colors.onSurfaceVariant }]}>
          {tip.content}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="text" 
          onPress={() => toggleSave(tip.id)}
          icon={tip.saved ? 'bookmark' : 'bookmark-outline'}
          labelStyle={{ color: tip.saved ? theme.colors.primary : theme.colors.onSurfaceVariant }}
        >
          {tip.saved ? 'Saved' : 'Save'}
        </Button>
        <Button mode="text" icon="arrow-right">
          Read More
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderExamResource = (resource: typeof EXAM_RESOURCES[0]) => (
    <Card key={resource.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.resourceHeader}>
          <View>
            <Title style={styles.resourceTitle}>{resource.title}</Title>
            <View style={styles.resourceMeta}>
              <Text style={[styles.resourceSubject, { color: theme.colors.primary }]}>
                {resource.subject}
              </Text>
              <Text style={[styles.resourceType, { color: theme.colors.onSurfaceVariant }]}>
                • {resource.type}
              </Text>
            </View>
          </View>
          <Chip 
            mode="outlined" 
            style={styles.yearChip}
            textStyle={styles.yearChipText}
          >
            {resource.year}
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode={resource.downloaded ? 'outlined' : 'contained'}
          onPress={() => toggleDownload(resource.id)}
          icon={resource.downloaded ? 'check' : 'download'}
        >
          {resource.downloaded ? 'Downloaded' : 'Download'}
        </Button>
        <Button mode="text" icon="eye-outline">
          Preview
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>Extras</Title>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Study tips, exam resources, and more
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search resources..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
        />
      </View>

      <View style={styles.tabs}>
        <Button
          mode={activeTab === 'tips' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('tips')}
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          labelStyle={activeTab === 'tips' ? styles.activeTabText : styles.inactiveTabText}
        >
          Study Tips
        </Button>
        <Button
          mode={activeTab === 'resources' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('resources')}
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          labelStyle={activeTab === 'resources' ? styles.activeTabText : styles.inactiveTabText}
        >
          Exam Resources
        </Button>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {activeTab === 'tips' ? (
          <View style={styles.tipsContainer}>
            {filteredTips.length > 0 ? (
              filteredTips.map(tip => renderStudyTip(tip))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="lightbulb-on-outline" 
                  size={64} 
                  color={theme.colors.onSurfaceDisabled}
                />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No study tips found. Try a different search term.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.resourcesContainer}>
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => renderExamResource(resource))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="file-document-outline" 
                  size={64} 
                  color={theme.colors.onSurfaceDisabled}
                />
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  No exam resources found. Try a different search term.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4A6FA5',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chip: {
    height: 24,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 10,
    lineHeight: 20,
  },
  yearChip: {
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
  },
  yearChipText: {
    fontSize: 12,
    color: '#4A6FA5',
  },
  duration: {
    fontSize: 12,
  },
  tipTitle: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },
  tipContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceSubject: {
    fontSize: 14,
    fontWeight: '600',
  },
  resourceType: {
    fontSize: 12,
  },
  emptyState: {
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

export default ExtrasScreen;
