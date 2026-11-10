import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { typography } from '../../../theme/tokens';

export default function MedicationListHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>복용목록</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="약 추가" onPress={() => router.push('/search')} style={styles.addButton}>
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 72, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.pageTitle },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 32, fontWeight: '400' },
});
