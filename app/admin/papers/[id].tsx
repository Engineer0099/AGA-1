import { useUser } from '@/hooks/useUser';
import { fetchDocumentById, isOnline } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function PaperDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [paper, setPaper] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean>(true);
  const {user} = useUser();


  //Load paper with paper id from DB
  const loadPaperByIdFromDB = async () => {
    try{
        const loadedPaper = await fetchDocumentById(
        '68ca66480039a017b799',
        'past_paper',
        id as string
      )
      return loadedPaper;
    }catch(error){
      console.error('Error Loading Paper from Database', error)
      return []
    }
    
  };

  //Load paper with id locally
  const loadPaperByIdLocally = async() => {
    try{
      const loadedPaper = await AsyncStorage.getItem('paper');
      return loadedPaper ? JSON.parse(loadedPaper as any) : []
    }catch(error){
      console.error("Error Loading Paper Locally", error)
      return []
    }
  };


  useEffect( () => {
    setLoading(true);
    (async() => {
      setOnline(await isOnline());
      let loadedPapers = [];
      try {
        if (online) {
          loadedPapers = await loadPaperByIdFromDB() as any;
          // Save to local storage
          AsyncStorage.setItem('paper', JSON.stringify(loadedPapers));
        } else {
          loadedPapers = await loadPaperByIdLocally();
        }
        setPaper(loadedPapers);
      } catch (error) {
        console.error('Error loading papers:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleDownload = () => {
    if(user?.plan === 'free'){
      Alert.alert('Upgrade Required', 'Downloading papers is available for Premium users only. Please upgrade your plan to access this feature.');
      return;
    }else if(!paper?.fileId){
      Alert.alert('File Not Available', 'The file for this paper is not available for download.');
      return;
    }else if(!paper){
      Alert.alert('Paper Not Loaded', 'The paper details are not fully loaded yet. Please try again later.');
      return;
    }else if(!online){
      Alert.alert('Offline', 'You are currently offline. Please connect to the internet to download the paper.');
      return;
    }else{
      console.log("Downloading paper with ID:", paper.$id);
      console.log("File ID:", paper.fileId);
      Alert.alert('Download', 'The download feature is not implemented yet.');
    }
  };

  const handleView = () => {
    console.log("Viewing paper with ID:", paper.$id);
    console.log("File ID:", paper.fileId);
    router.push(`/${paper.$id}/PaperView` as any);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="document-text" size={48} color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading paper details...</Text>
      </View>
    );
  }

  if (!paper) {
    return (
      <View style={styles.container}>
        <Text>Paper not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A6FA5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paper Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.paperHeader}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(paper.type) }]}>
              <Text style={styles.typeText}>{paper.type}</Text>
            </View>
            <Text style={styles.title}>{paper.title}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>{paper.subject}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>Year {paper.year}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{paper.fileType}</Text>
            </View>
          </View>

          {paper.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{paper.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>File Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>File Type:</Text>
              <Text style={styles.infoValue}>{paper.fileType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Uploaded:</Text>
              <Text style={styles.infoValue}>{paper?.$updatedAt ? new Date(paper.$updatedAt).toLocaleDateString() : 0}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Downloads:</Text>
              <Text style={styles.infoValue}>{paper?.downloads? paper.downloads.toLocaleString() : 123}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerButton, { backgroundColor: '#EFF6FF' }]}
          onPress={handleView}
        >
          <Ionicons name="eye-outline" size={20} color="#4A6FA5" />
          <Text style={[styles.footerButtonText, { color: '#4A6FA5' }]}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerButton, { backgroundColor: '#4A6FA5' }]}
          onPress={handleDownload}
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={[styles.footerButtonText, { color: 'white' }]}>Download</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'Final': return '#EF4444';
    case 'Midterm': return '#F59E0B';
    case 'Quiz': return '#10B981';
    case 'Practice': return '#8B5CF6';
    default: return '#6B7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  paperHeader: {
    marginBottom: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
