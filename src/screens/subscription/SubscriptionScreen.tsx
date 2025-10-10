import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Button, Card, Title, Text, useTheme, Divider, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Mock subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Primary School',
    price: 'TZS 5,000',
    duration: 'per year',
    features: [
      'Access to all primary school materials',
      'Download up to 10 items',
      'Basic support',
    ],
    popular: false,
    level: 'primary',
  },
  {
    id: 'standard',
    name: 'Secondary School',
    price: 'TZS 10,000',
    duration: 'per year',
    features: [
      'Access to all secondary school materials',
      'Unlimited downloads',
      'Priority support',
      'Practice tests',
    ],
    popular: true,
    level: 'secondary',
  },
  {
    id: 'premium',
    name: 'University',
    price: 'TZS 15,000',
    duration: 'per year',
    features: [
      'Access to all university materials',
      'Unlimited downloads',
      '24/7 priority support',
      'Practice tests',
      'Offline access',
    ],
    popular: false,
    level: 'university',
  },
];

const SubscriptionScreen = () => {
  const theme = useTheme();
  const { user, completeSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would handle the payment here
    completeSubscription();
    setSubscriptionSuccess(true);
    setIsProcessing(false);
  };

  const renderPlanCard = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    const isCurrentPlan = user?.schoolLevel === plan.level;
    const isSelected = selectedPlan === plan.id;
    
    return (
      <Card 
        key={plan.id} 
        style={[
          styles.planCard, 
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
          isCurrentPlan && { borderColor: theme.colors.primary, borderWidth: 1, backgroundColor: 'rgba(74, 111, 165, 0.05)' }
        ]}
        onPress={() => !isCurrentPlan && setSelectedPlan(plan.id)}
      >
        <Card.Content>
          <View style={styles.planHeader}>
            <Title style={styles.planName}>{plan.name}</Title>
            {plan.popular && (
              <Chip 
                mode="outlined" 
                style={styles.popularChip}
                textStyle={styles.popularChipText}
              >
                POPULAR
              </Chip>
            )}
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.duration}>/{plan.duration}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.featuresList}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.featureIcon} 
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          <Button
            mode={isCurrentPlan ? 'outlined' : isSelected ? 'contained' : 'outlined'}
            onPress={() => isCurrentPlan ? null : setSelectedPlan(plan.id)}
            style={styles.planButton}
            disabled={isCurrentPlan}
            labelStyle={styles.planButtonLabel}
          >
            {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  if (subscriptionSuccess) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: 'rgba(40, 167, 69, 0.1)' }]}>
            <MaterialCommunityIcons name="check-circle" size={64} color="#28a745" />
          </View>
          <Title style={styles.successTitle}>Subscription Successful!</Title>
          <Text style={[styles.successText, { color: theme.colors.onSurfaceVariant }]}>
            Thank you for subscribing to {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.name}.
            You now have full access to all materials.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => setSubscriptionSuccess(false)}
            style={styles.successButton}
          >
            Continue to App
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Title style={styles.title}>Subscription Plans</Title>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Choose the plan that works best for you
          </Text>
        </View>

        {user?.isSubscribed ? (
          <Card style={styles.currentPlanCard}>
            <Card.Content>
              <View style={styles.currentPlanHeader}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <Title style={styles.currentPlanTitle}>Active Subscription</Title>
              </View>
              <Text style={styles.currentPlanText}>
                You are currently subscribed to the {user.schoolLevel} plan.
              </Text>
              {user.subscriptionExpiry && (
                <Text style={styles.expiryText}>
                  Expires on: {new Date(user.subscriptionExpiry).toLocaleDateString()}
                </Text>
              )}
              <Button 
                mode="outlined" 
                style={styles.manageButton}
                onPress={() => {}}
              >
                Manage Subscription
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
            Subscribe to access all features and materials
          </Text>
        )}

        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map(plan => renderPlanCard(plan))}
        </View>

        {!user?.isSubscribed && selectedPlan && (
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleSubscribe}
              style={styles.subscribeButton}
              loading={isProcessing}
              disabled={isProcessing}
              icon={isProcessing ? () => <ActivityIndicator color="white" /> : 'lock'}
            >
              {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </Button>
            <Text style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
              Your subscription will automatically renew. You can cancel anytime.
            </Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  currentPlanCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 111, 165, 0.05)',
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPlanTitle: {
    marginLeft: 8,
    fontSize: 20,
  },
  currentPlanText: {
    marginBottom: 8,
    fontSize: 16,
  },
  expiryText: {
    marginBottom: 16,
    fontWeight: '600',
    color: '#4A6FA5',
  },
  manageButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  popularChip: {
    height: 24,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderColor: '#FFC107',
  },
  popularChipText: {
    color: '#FFC107',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A6FA5',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    marginVertical: 12,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  planButton: {
    marginTop: 8,
  },
  planButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 8,
  },
  subscribeButton: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successButton: {
    width: '100%',
    paddingVertical: 6,
  },
});

export default SubscriptionScreen;
