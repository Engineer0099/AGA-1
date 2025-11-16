import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';

type Subscription = {
  id: string;
  planName: string;
  price: string;
  status: SubscriptionStatus;
  nextBillingDate: string | null;
  paymentMethod: string | null;
};

const PREMIUM_PLAN = {
  id: 'premium_monthly',
  name: 'Premium',
  price: '1,000',
  currency: 'TZS',
  period: 'month',
  features: [
    'Access to all educational content',
    'Download materials offline',
    'Unlimited practice tests',
    'Ad-free experience',
    'Priority support'
  ]
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: 'phone-portrait-outline' | 'card-outline';
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'phone-portrait-outline' },
  { id: 'airtelmoney', name: 'Airtel Money', icon: 'phone-portrait-outline' },
  { id: 'tigopesa', name: 'Tigo Pesa', icon: 'phone-portrait-outline' },
  { id: 'visa', name: 'Visa/Mastercard', icon: 'card-outline' },
];

type FAQItem = {
  question: string;
  answer: string;
};

const FAQS: FAQItem[] = [
  {
    question: 'How does the subscription work?',
    answer: 'Your subscription will automatically renew each month for 1,000 TZS. You can cancel any time.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from this screen. Your access will continue until the end of the current billing period.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a 5-day free trial for all new users. You can cancel anytime during the trial period.'
  }
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription>({
    id: 'sub_123',
    planName: 'Premium Monthly',
    price: '1,000 TZS',
    status: 'inactive',
    nextBillingDate: null,
    paymentMethod: null
  });

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubscription({
        ...subscription,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'VISA •••• 4242'
      });
      
      Alert.alert('Success', 'Your subscription is now active!');
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        {
          text: 'No, Keep It',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setSubscription({
              ...subscription,
              status: 'cancelled',
              nextBillingDate: null
            });
            Alert.alert('Cancelled', 'Your subscription will remain active until the end of the current billing period.');
          },
        },
      ]
    );
  };

  const renderSubscriptionStatus = () => (
    <View style={styles.statusContainer}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusTitle}>
          {subscription.status === 'active' ? 'Active Subscription' : 'Inactive Subscription'}
        </Text>
        <View style={[
          styles.statusBadge,
          subscription.status === 'active' ? styles.statusActive : styles.statusInactive
        ]}>
          <Text style={styles.statusText}>
            {subscription.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planName}>{PREMIUM_PLAN.name}</Text>
            <Text style={styles.planPrice}>1,000 TZS <Text style={styles.planPeriod}>/month</Text></Text>
          </View>
          {subscription.status === 'active' && subscription.nextBillingDate && (
            <View style={styles.billingInfo}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.billingText}>
                Renews: {subscription.nextBillingDate}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.featuresList}>
          {PREMIUM_PLAN.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        {subscription.status === 'active' ? (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>
              {isLoading ? 'Processing...' : 'Cancel Subscription'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeButtonText}>Subscribe for 1,000 TZS/month</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      <View style={styles.paymentMethods}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id}
            style={styles.paymentMethod}
            onPress={() => handlePaymentMethodSelect(method.id)}
          >
            <View style={styles.paymentIconContainer}>
              <Ionicons name={method.icon} size={20} color="#4A6FA5" />
            </View>
            <Text style={styles.paymentMethodText}>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderFAQSection = () => (
    <View style={styles.faqSection}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      
      {FAQS.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
      ))}
    </View>
  );
  
  const handlePaymentMethodSelect = (methodId: string) => {
    // Handle payment method selection
    console.log('Selected payment method:', methodId);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>AGA Premium</Text>
        <Text style={styles.subtitle}>Unlock all features and content</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSubscriptionStatus()}
        {renderPaymentMethods()}
        {renderFAQSection()}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Questions? Contact support@aga.com</Text>
          <Text style={[styles.footerText, { marginTop: 8 }]}>© 2025 KISO. All rights reserved.</Text>
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
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paymentMethod: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4A6FA5',
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statusContainer: {
    margin: 20,
    marginTop: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A6FA5',
  },
  planPeriod: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'normal',
  },
  billingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  billingText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    flex: 1,
    marginLeft: 8,
    color: '#4B5563',
    lineHeight: 22,
  },
  subscribeButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  faqSection: {
    margin: 20,
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
