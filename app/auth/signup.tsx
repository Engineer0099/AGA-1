import { View, StyleSheet } from 'react-native';
import { SignUpScreen } from '../../src/screens/auth/SignUpScreen';

export default function SignUp() {
  return (
    <View style={styles.container}>
      <SignUpScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
