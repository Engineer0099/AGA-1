import { Text, View } from "react-native";
  
  
  
  const TopicScreen = () => {
    
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

export default TopicScreen;