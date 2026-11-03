import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function MedicationListHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>복용목록</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="약 추가" onPress={() => Alert.alert('약 추가', '약 추가 화면은 준비 중입니다.')} style={styles.addButton}>
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 64, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '600', color: '#111111' },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 28, lineHeight: 32, fontWeight: '400' },
});
