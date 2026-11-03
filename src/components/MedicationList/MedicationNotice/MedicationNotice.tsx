import { StyleSheet, Text, View } from 'react-native';

export default function MedicationNotice() {
  return (
    <View style={styles.notice}>
      <Text style={styles.refreshIcon}>⟳</Text>
      <Text style={styles.noticeText}>새로운 약을 추가하면 기존 목록과 자동으로 재검사하여 상호작용 여부를 알려드립니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { minHeight: 84, borderRadius: 16, backgroundColor: '#F2F3F5', paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  refreshIcon: { color: '#111111', fontSize: 26, fontWeight: '600' },
  noticeText: { flex: 1, color: '#445064', fontSize: 14, lineHeight: 23 },
});
