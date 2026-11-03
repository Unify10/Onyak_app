import { StyleSheet, Text, View } from 'react-native';

export default function PageTitle() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>가족</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '95%', paddingHorizontal: 4, paddingVertical: 12 },
  title: { color: '#111111', fontSize: 22, fontWeight: '600' },
});
