import { useUser } from '@/hooks/useUser';
import { fetchDocumentCount, fetchRecentActivityLogs } from '@/utils/util';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type QuickAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  route: string;
  iconColor?: string;
};

type StatItem = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
};

type RecentActivity = {
  id: string;
  action: string;
  subject: string;
  time: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
};

const DashboardScreen = () => {
  usePreventScreenCapture();
  const [totalUsers , setTotalUsers] = useState<string | null>(null);
  const [totalSubjects , setTotalSubjects] = useState<string | null>(null);
  const [totalPapers , setTotalPapers] = useState<string | null>(null);
  const [totalNotifications , setTotalNotifications] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} days ago`;
    }
  };

  const getTimeInterval = (timestamp: string): number => {
    const now = new Date();
    const past = new Date(timestamp);
    return now.getTime() - past.getTime();
  };

  // Fetch total users count on mount
  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true); 
      const userCount = await fetchDocumentCount('68ca66480039a017b799', 'user');
      setTotalUsers(userCount?.toString() || '0');

      const subjectCount = await fetchDocumentCount('68ca66480039a017b799', 'subject');
      setTotalSubjects(subjectCount?.toString() || '0');

      const paperCount = await fetchDocumentCount('68ca66480039a017b799', 'past_paper');
      setTotalPapers(paperCount?.toString() || '0');

      const notificationCount = await fetchDocumentCount('68ca66480039a017b799', 'notification');
      setTotalNotifications(notificationCount?.toString() || '0');

      let activities: RecentActivity[] = [];
      const usersLogs = await fetchRecentActivityLogs('68ca66480039a017b799', 'user');
      activities = activities.concat(usersLogs.map(log => ({ ...log, action: 'New user registered', time: log.$createdAt, subject: log.email })));
      const papersLogs = await fetchRecentActivityLogs('68ca66480039a017b799', 'past_paper');
      activities = activities.concat(papersLogs.map(log => ({ ...log, action: 'Paper uploaded', time: log.$createdAt })));
      const notesLogs = await fetchRecentActivityLogs('68ca66480039a017b799', 'notes');
      activities = activities.concat(notesLogs.map(log => ({ ...log, action: 'Note updated', time: log.$createdAt })));
      

      // Sort activities by time (assuming time is in a format that can be compared as strings)
      activities.sort((a, b) => (getTimeInterval(a.time) > getTimeInterval(b.time) ? 1 : -1));
        
      // Limit to 5 recent activities
      setRecentActivities(activities.slice(0, 5));
      setIsLoading(false);
    };
    fetchCounts();
  }, []);
  // Quick actions data with valid routes
  const quickActions: QuickAction[] = [
    { 
      label: 'Users', 
      icon: 'people', 
      bgColor: 'rgba(59, 130, 246, 0.1)', 
      iconColor: '#3b82f6',
      route: '/admin/users' 
    },
    { 
      label: 'Papers', 
      icon: 'document-text', 
      bgColor: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10b981',
      route: '/admin/papers' 
    },
    { 
      label: 'Notes', 
      icon: 'create', 
      bgColor: 'rgba(139, 92, 246, 0.1)',
      iconColor: '#8b5cf6',
      route: '/admin/notes' 
    },
    { 
      label: 'Tips', 
      icon: 'bulb', 
      bgColor: 'rgba(236, 72, 153, 0.1)',
      iconColor: '#ec4899',
      route: '/admin/tips' 
    },
    {
      label: 'Subjects', 
      icon: 'book', 
      bgColor: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#f59e0b',
      route: '/admin/subjects'
    },
    {
      label: 'Notifications', 
      icon: 'notifications', 
      bgColor: 'rgba(14, 165, 233, 0.1)',
      iconColor: '#0ea5e9',
      route: '/admin/notification'
    },
  ];

  // Stats data with trends
  const stats: StatItem[] = [
    { 
      label: 'Active Users', 
      value: totalUsers as string || '0', 
      icon: 'people-outline', 
      color: '#4F46E5',
      trend: 'up',
      trendValue: '12%'
    },
    { 
      label: 'Total Subjects', 
      value: totalSubjects as string || '0', 
      icon: 'book-outline', 
      color: '#10B981',
      trend: 'up',
      trendValue: '4%'
    },
    { 
      label: 'Past Papers', 
      value: totalPapers as string || '0', 
      icon: 'document-text-outline', 
      color: '#F59E0B',
      trend: 'up',
      trendValue: '8%'
    },
    { 
      label: 'Notifications', 
      value: totalNotifications as string || '0', 
      icon: 'notifications-outline', 
      color: '#EC4899',
      trend: 'down',
      trendValue: '3%'
    },
  ];

  // const recentActivities: RecentActivity[] = [
  //   { 
  //     id: '1', 
  //     action: 'New user registered', 
  //     subject: 'john.doe@example.com', 
  //     time: '2 hours ago',
  //     icon: 'person-add',
  //     iconColor: '#3b82f6'
  //   },
  //   { 
  //     id: '2', 
  //     action: 'Paper uploaded', 
  //     subject: 'Mathematics 2023 Final', 
  //     time: '5 hours ago',
  //     icon: 'document-attach',
  //     iconColor: '#10b981'
  //   },
  //   { id: '3', action: 'Note updated', subject: 'Chemistry Basics', time: '1 day ago' },
  //   { id: '4', action: 'Subscription renewed', subject: 'Premium Plan', time: '2 days ago' },
  // ];

  // Define activity icon colors
  const getActivityIconColor = (action: string): string => {
    switch (action) {
      case 'New user registered':
        return '#3b82f6';
      case 'Paper uploaded':
        return '#10b981';
      case 'Note updated':
        return '#8b5cf6';
      case 'Subscription renewed':
        return '#f59e0b';
      default:
        return '#9CA3AF';
    }
  };

  // Fix TypeScript error for activity icon
  const getActivityIcon = (action: string): keyof typeof Ionicons.glyphMap => {
    switch (action) {
      case 'New user registered':
        return 'person-add';
      case 'Paper uploaded':
        return 'document-attach';
      case 'Note updated':
        return 'create';
      case 'Subscription renewed':
        return 'card';
      default:
        return 'notifications';
    }
  };

  const navigateToSection = (route: '/admin/users' | '/admin/papers' | '/admin/notes' | '/admin/profile') => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{user?.name || "Admin"}</Text>
        </View>
        
        {/*User icon */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigateToSection('/admin/profile')}>
          <Ionicons name="person-circle-outline" size={35} color="#6d9bdbff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.bgColor }]}
              onPress={() => navigateToSection(action.route as any)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.iconColor + '20' }]}>
                <Ionicons name={action.icon} size={20} color={action.iconColor} />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>Stats</Text>
        <FlatList
          data={stats}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
          keyExtractor={(item, index) => `stat-${index}`}
          renderItem={({ item: stat, index }) => (
            <View style={[styles.statCard, { marginRight: index < stats.length - 1 ? 12 : 0 }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.trend && (
                  <View style={[styles.trend, { backgroundColor: stat.trend === 'up' ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Ionicons 
                      name={stat.trend === 'up' ? 'trending-up' : 'trending-down'} 
                      size={12} 
                      color={stat.trend === 'up' ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={[styles.trendText, { color: stat.trend === 'up' ? '#10B981' : '#EF4444' }]}>
                      {stat.trendValue}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {isLoading ? (
              <View>
                <Text>Loading activities...</Text>
                <ActivityIndicator size="small" color="#4A6FA5" />
              </View>
            ) :recentActivities?.map((activity, index) => {
              const iconColor = getActivityIconColor(activity.action);
              return (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${iconColor}20` }]}>
                    <Ionicons name={getActivityIcon(activity.action)} size={16} color={iconColor} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activitySubject}>{activity.subject}</Text>
                  </View>
                  <Text style={styles.activityTime}>{getTimeAgo(activity.time)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  } as ViewStyle,
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  } as ViewStyle,
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  adminName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A202C',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  content: {
    padding: 16,
    paddingBottom: 24,
  } as ViewStyle,
  statsContainer: {
    paddingBottom: 8,
  } as ViewStyle,
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: 160,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  } as ViewStyle,
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    marginTop: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  } as ViewStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 64) / 3,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  } as ViewStyle,
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  activitySubject: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    textAlign: 'center',
  },
});

export default DashboardScreen;
