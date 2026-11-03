import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';
import type { Medicine } from '../types';

type Props = {
  query: string;
  medicines: Medicine[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSelectMedicine: (medicine: Medicine) => void;
};

export default function SearchResults({ query, medicines, page, pageCount, onPageChange, onSelectMedicine }: Props) {
  return (
    <View>
      <View style={styles.heading}><AppText style={styles.sectionTitle}>{query ? '검색 결과' : '이전 검색결과'}</AppText></View>
      {medicines.length ? medicines.map(medicine => (
        <Pressable key={medicine.id} style={styles.card} onPress={() => onSelectMedicine(medicine)} accessibilityRole="button">
          <View style={styles.imagePlaceholder}>
            <Ionicons name="medical-outline" size={24} color="#B0B6C0" />
            <AppText style={styles.placeholderText}>약 이미지</AppText>
          </View>
          <View style={styles.info}>
            <AppText style={styles.name}>{medicine.name}</AppText>
            <AppText style={styles.detail}>{medicine.ingredient} · {medicine.kind}</AppText>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#C5CBD3" />
        </Pressable>
      )) : <EmptyState />}
      {pageCount > 1 && (
        <View style={styles.pagination}>
          <Pressable style={styles.pageArrow} disabled={page === 1} onPress={() => onPageChange(Math.max(1, page - 1))} accessibilityRole="button" accessibilityLabel="이전 페이지">
            <Ionicons name="chevron-back" size={20} color={page === 1 ? '#C8CDD4' : '#171C26'} />
          </Pressable>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => (
            <Pressable key={pageNumber} style={[styles.pageNumber, pageNumber === page && styles.pageNumberSelected]} onPress={() => onPageChange(pageNumber)} accessibilityRole="button" accessibilityState={{ selected: pageNumber === page }} accessibilityLabel={`페이지 ${pageNumber}`}>
              <AppText style={[styles.pageNumberText, pageNumber === page && styles.pageNumberTextSelected]}>{pageNumber}</AppText>
            </Pressable>
          ))}
          <Pressable style={styles.pageArrow} disabled={page === pageCount} onPress={() => onPageChange(Math.min(pageCount, page + 1))} accessibilityRole="button" accessibilityLabel="다음 페이지">
            <Ionicons name="chevron-forward" size={20} color={page === pageCount ? '#C8CDD4' : '#171C26'} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={31} color="#B5BBC3" />
      <AppText style={styles.emptyTitle}>검색 결과가 없습니다.</AppText>
      <AppText style={styles.emptyDescription}>약 이름, 성분명 또는 증상 키워드를 확인해 주세요.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 12 },
  sectionTitle: { flex: 1, color: '#7E8795', fontSize: 17 },
  card: { minHeight: 111, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 17, padding: 12, marginBottom: 11 },
  imagePlaceholder: { width: 72, height: 78, borderRadius: 13, backgroundColor: '#E7E9ED', alignItems: 'center', justifyContent: 'center', marginRight: 13, gap: 3 },
  placeholderText: { color: '#FFFFFF', fontSize: 12 },
  info: { flex: 1, paddingVertical: 7 },
  name: { color: '#171C26', fontSize: 19, fontWeight: '600' },
  detail: { color: '#7E8795', fontSize: 16, lineHeight: 21, marginTop: 4 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 8, gap: 7 },
  pageArrow: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  pageNumber: { width: 34, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  pageNumberSelected: { backgroundColor: '#E8F5F1' },
  pageNumberText: { color: '#7E8795', fontSize: 17 },
  pageNumberTextSelected: { color: '#39A887', fontWeight: '700' },
  empty: { minHeight: 150, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8EAED', borderRadius: 16, padding: 20 },
  emptyTitle: { color: '#171C26', fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 10 },
  emptyDescription: { color: '#7E8795', fontSize: 16, textAlign: 'center', lineHeight: 23, marginTop: 6 },
});
