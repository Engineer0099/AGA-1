import { View, StyleSheet } from 'react-native';
import ExtrasScreen from '../../../src/screens/extras/ExtrasScreen';

export default function Extras() {
  return (
    <View style={styles.container}>
      <ExtrasScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
