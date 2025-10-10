import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, IconButton, Menu, Text, TextInput, Title, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for admin
const RECENT_UPLOADS = [
  {
    id: '1',
    title: 'Mathematics Form 2 Notes',
    type: 'PDF',
    date: '2023-05-15',
    status: 'published',
    views: 245,
    downloads: 189,
  },
  {
    id: '2',
    title: 'Physics Practical Guide',
    type: 'Guide',
    date: '2023-05-10',
    status: 'pending',
    views: 120,
    downloads: 85,
  },
  {
    id: '3',
    title: 'Chemistry Form 4 Past Papers',
    type: 'PDF',
    date: '2023-05-05',
    status: 'published',
    views: 312,
    downloads: 278,
  },
];

const AdminScreen = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expiryDate, setExpiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleUpload = () => {
    // In a real app, this would handle file upload
    Alert.alert('Upload', 'File upload functionality will be implemented here');
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(event.target.value);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setSelectedDate(currentDate);
  };

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>1,245</Title>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>856</Title>
            <Text style={styles.statLabel}>Active Subscribers</Text>
          </Card.Content>
        </Card>
      </View>
      
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>124</Title>
            <Text style={styles.statLabel}>Total Materials</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>2,345</Title>
            <Text style={styles.statLabel}>Total Downloads</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.recentUploadsCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Recent Uploads</Title>
            <Button 
              mode="text" 
              onPress={() => setActiveTab('upload')}
              icon="plus"
              labelStyle={{ color: theme.colors.primary }}
            >
              New Upload
            </Button>
          </View>
          
          {RECENT_UPLOADS.map((upload, index) => (
            <React.Fragment key={upload.id}>
              {index > 0 && <Divider />}
              <View style={styles.uploadItem}>
                <View style={styles.uploadInfo}>
                  <Text style={styles.uploadTitle}>{upload.title}</Text>
                  <View style={styles.uploadMeta}>
                    <Chip 
                      mode="outlined" 
                      style={styles.uploadChip}
                      textStyle={styles.uploadChipText}
                    >
                      {upload.type}
                    </Chip>
                    <Text style={styles.uploadDate}>{upload.date}</Text>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.statusChip,
                        upload.status === 'published' && styles.statusPublished,
                        upload.status === 'pending' && styles.statusPending,
                      ]}
                      textStyle={styles.statusChipText}
                    >
                      {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                    </Chip>
                  </View>
                  <View style={styles.uploadStats}>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons 
                        name="eye-outline" 
                        size={16} 
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={styles.statText}>{upload.views} views</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MaterialCommunityIcons 
                        name="download-outline" 
                        size={16} 
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={styles.statText}>{upload.downloads} downloads</Text>
                    </View>
                  </View>
                </View>
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                  size={20}
                />
              </View>
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderUploadForm = () => (
    <Card style={styles.uploadFormCard}>
      <Card.Content>
        <Title style={styles.cardTitle}>Upload New Material</Title>
        
        <TextInput
          label="Title"
          mode="outlined"
          style={styles.input}
          placeholder="Enter material title"
        />
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 2 }]}>
            <TextInput
              label="Subject"
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Mathematics"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <TextInput
              label="Type"
              mode="outlined"
              style={styles.input}
              placeholder="e.g. PDF"
            />
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <TextInput
              label="Level"
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Form 4"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <TextInput
              label="Year"
              mode="outlined"
              style={styles.input}
              placeholder="e.g. 2023"
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.datePickerContainer}>
          <TextInput
            type="date"
            value={expiryDate}
            onChange={handleDateChange}
            style={styles.dateInput}
          />
        </View>
        
        <TextInput
          label="Description"
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
          placeholder="Enter a brief description of the material"
        />
        
        <View style={styles.fileUploadContainer}>
          <Button
            mode="outlined"
            onPress={handleUpload}
            icon="file-upload"
            style={styles.uploadButton}
          >
            Choose File
          </Button>
          <Text style={styles.fileName}>No file chosen</Text>
        </View>
        
        <View style={styles.formActions}>
          <Button
            mode="outlined"
            onPress={() => setActiveTab('dashboard')}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              // Handle form submission
              Alert.alert('Success', 'Material uploaded successfully');
              setActiveTab('dashboard');
            }}
            style={styles.submitButton}
          >
            Upload Material
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Admin Dashboard</Title>
        <View style={styles.headerActions}>
          <IconButton
            icon="bell-outline"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="account-circle"
            size={32}
            onPress={() => {}}
          />
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' ? renderDashboard() : renderUploadForm()}
      </ScrollView>
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        contentStyle={{ marginTop: 40, marginLeft: -20 }}
      >
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            // Handle edit
          }} 
          title="Edit" 
          leadingIcon="pencil"
        />
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            // Handle delete
          }} 
          title="Delete" 
          leadingIcon="delete"
          titleStyle={{ color: theme.colors.error }}
        />
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            // Handle view stats
          }} 
          title="View Stats" 
          leadingIcon="chart-bar"
        />
      </Menu>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dashboardContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  recentUploadsCard: {
    marginTop: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  uploadInfo: {
    flex: 1,
    marginRight: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  uploadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  uploadChip: {
    height: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  uploadChipText: {
    fontSize: 10,
    lineHeight: 18,
  },
  uploadDate: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  statusChip: {
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  statusPublished: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    borderColor: '#28a745',
  },
  statusPending: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderColor: '#ffc107',
  },
  statusChipText: {
    fontSize: 10,
    lineHeight: 18,
  },
  uploadStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  uploadFormCard: {
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  fileUploadContainer: {
    marginBottom: 24,
  },
  uploadButton: {
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    minWidth: 160,
  },
  dateInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'sans-serif',
  },
});

export default AdminScreen;
