import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';
import type { SearchHistoryProps } from '../types';

export default function SearchHistoryList({ recentSearches, onSelect, onDelete, onClear }: SearchHistoryProps) {
  function confirmClear() {
    Alert.alert('검색 기록 삭제', '검색 기록을 모두 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '전체 삭제', style: 'destructive', onPress: onClear },
    ]);
  }

  if (!recentSearches.length) return null;

  return (
    <View style={styles.container}>
      <AppText style={styles.heading}>최근 검색</AppText>
      {recentSearches.map((entry, index) => (
        <View key={`${entry.query}-${index}`} style={[styles.row, index < recentSearches.length - 1 && styles.border]}>
          <Pressable style={styles.select} onPress={() => onSelect(entry)} accessibilityRole="button">
            <Ionicons name="time-outline" size={20} color="#7E8795" />
            <AppText style={styles.query}>{entry.query}</AppText>
            <AppText style={styles.date}>{entry.searchedAt == null ? '' : new Date(entry.searchedAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</AppText>
          </Pressable>
          <Pressable onPress={() => onDelete(entry.query)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`${entry.query} 기록 삭제`}>
            <Ionicons name="close" size={19} color="#AAB1BB" />
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.clear} onPress={confirmClear} accessibilityRole="button">
        <AppText style={styles.clearText}>전체 기록 삭제</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 3 },
  heading: { minHeight: 45, color: '#7E8795', fontSize: 17, paddingTop: 10, marginBottom: 8 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center' },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E6E8EC' },
  select: { flex: 1, minHeight: 55, flexDirection: 'row', alignItems: 'center' },
  query: { flex: 1, color: '#171C26', marginLeft: 10 },
  date: { color: '#7E8795', fontSize: 15, marginRight: 12 },
  clear: { alignSelf: 'flex-end', marginTop: 12, paddingVertical: 5 },
  clearText: { color: '#7E8795', fontSize: 13 },
});
