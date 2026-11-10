import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../../../theme/tokens';

export default function PageTitle() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>가족</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', height: 72, paddingHorizontal: 4, justifyContent: 'center' },
  title: { ...typography.pageTitle },
});
