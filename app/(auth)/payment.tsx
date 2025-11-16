import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const PAYMENT_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'phone-portrait-outline' as const },
  { id: 'airtelmoney', name: 'Airtel Money', icon: 'phone-portrait-outline' as const },
  { id: 'tigopesa', name: 'Tigo Pesa', icon: 'phone-portrait-outline' as const },
  { id: 'visa', name: 'Visa/Mastercard', icon: 'card-outline' as const },
];

export default function PaymentScreen() {
  //const { level } = useLocalSearchParams<{ level: string }>();
  //const insets = useSafeAreaInsets();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      AsyncStorage.setItem('onboardingComplete', 'true').then(() => {
        router.replace('/(tabs)/library');
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Activate Your Plan</Text>
          <Text style={styles.subtitle}>Start your 5-day free trial</Text>
        </View>

        {/* Plan Details Card */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{PREMIUM_PLAN.name}</Text>
            <Text style={styles.planPrice}>{PREMIUM_PLAN.price} TZS <Text style={styles.planPeriod}>/month</Text></Text>
          </View>
          <View style={styles.featuresList}>
            {PREMIUM_PLAN.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <View style={styles.paymentMethods}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.id && styles.paymentMethodSelected
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.paymentIconContainer}>
                  <Ionicons name={method.icon} size={20} color="#4A6FA5" />
                </View>
                <Text style={styles.paymentMethodText}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer with Subscribe Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.subscribeButton, isProcessing && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.note}>
          You will be charged 1,000 TZS/month after your 5-day trial ends. Cancel anytime.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  featuresList: {
    marginBottom: 8,
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
  section: {
    marginBottom: 24,
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
  paymentMethodSelected: {
    borderColor: '#4A6FA5',
    backgroundColor: '#EFF6FF',
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  subscribeButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
