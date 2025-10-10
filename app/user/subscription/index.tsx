import { View, StyleSheet } from 'react-native';
import SubscriptionScreen from '../../../src/screens/subscription/SubscriptionScreen';

export default function Subscription() {
  return (
    <View style={styles.container}>
      <SubscriptionScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
