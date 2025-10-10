import { View, StyleSheet } from 'react-native';
import LibraryScreen from '../../../src/screens/library/LibraryScreen';

export default function Library() {
  return (
    <View style={styles.container}>
      <LibraryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
