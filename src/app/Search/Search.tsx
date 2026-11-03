import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Search() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>검색</Text>
      <Text style={styles.description}>약 이름이나 성분을 검색해 보세요.</Text>
      <View style={styles.searchBar}>
        <TextInput
          accessibilityLabel="약 이름 또는 성분 검색"
          onChangeText={setQuery}
          placeholder="약 이름 또는 성분 입력"
          placeholderTextColor="#98A2B3"
          returnKeyType="search"
          style={styles.input}
          value={query}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setSubmittedQuery(query.trim())}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>검색</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>{submittedQuery ? '검색 결과' : '최근 검색'}</Text>
      <Text style={styles.emptyState}>
        {submittedQuery
          ? `“${submittedQuery}” 검색 결과가 여기에 표시됩니다.`
          : '최근 검색 기록이 없습니다.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#FFFFFF' },
  title: { color: '#111111', fontSize: 24, fontWeight: '600' },
  description: { color: '#667085', fontSize: 15, marginTop: 8, marginBottom: 22 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 14, padding: 8 },
  input: { flex: 1, height: 42, paddingHorizontal: 10, color: '#111111', fontSize: 15 },
  searchButton: { borderRadius: 10, backgroundColor: '#111111', paddingHorizontal: 15, paddingVertical: 11 },
  searchButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  sectionTitle: { marginTop: 30, marginBottom: 12, color: '#111111', fontSize: 18, fontWeight: '600' },
  emptyState: { paddingVertical: 22, color: '#98A2B3', fontSize: 14 },
});
