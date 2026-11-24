import { medicineImageLayout } from '../../../theme/tokens';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';
import type { Medicine } from '../types';

type Props = {
  query: string;
  medicines: Medicine[];
  onSelectMedicine: (medicine: Medicine) => void;
};

export default function SearchResults({ query, medicines, onSelectMedicine }: Props) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  return (
    <View>
      <View style={styles.heading}><AppText style={styles.sectionTitle}>{query ? '검색 결과' : '이전 검색결과'}</AppText></View>
      {medicines.length ? medicines.map(medicine => (
        <Pressable key={medicine.id} style={styles.card} onPress={() => onSelectMedicine(medicine)} accessibilityRole="button">
          <View style={[styles.imagePlaceholder, medicineImageLayout]} accessibilityRole="image" accessibilityLabel={`${medicine.name} 이미지 영역`}>
            <Ionicons name="medical-outline" size={24} color="#B0B6C0" />
            <AppText style={styles.placeholderText}>약 이미지</AppText>
          </View>
          <View style={styles.info}>
            <AppText style={styles.name}>{medicine.name}</AppText>
            {(medicine.ingredient || medicine.kind) && <AppText style={styles.detail}>{[medicine.ingredient, medicine.kind].filter(Boolean).join(' · ')}</AppText>}
          </View>
          <Ionicons name="chevron-forward" size={22} color="#C5CBD3" />
        </Pressable>
      )) : <EmptyState />}
    </View>
  );
}

function EmptyState() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  return (
    <View style={styles.empty}>
      <Ionicons name="search-outline" size={31} color="#B5BBC3" />
      <AppText style={styles.emptyTitle}>검색 결과가 없습니다.</AppText>
      <AppText style={styles.emptyDescription}>약 이름, 성분명 또는 증상 키워드를 확인해 주세요.</AppText>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 12 },
  sectionTitle: { flex: 1, color: '#7E8795', fontSize: 17 },
  card: { minHeight: 111, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 17, padding: 12, marginBottom: 11 },
  imagePlaceholder: { borderRadius: 13, backgroundColor: '#E7E9ED', alignItems: 'center', justifyContent: 'center', marginRight: 13, gap: 3 },
  placeholderText: { color: '#FFFFFF', fontSize: 12 },
  info: { flex: 1, minWidth: 0, paddingVertical: 7 },
  name: { color: '#171C26', fontSize: 19, fontWeight: '600' },
  detail: { color: '#7E8795', fontSize: 16, lineHeight: 21, marginTop: 4 },
  empty: { minHeight: 150, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8EAED', borderRadius: 16, padding: 20 },
  emptyTitle: { color: '#171C26', fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 10 },
  emptyDescription: { color: '#7E8795', fontSize: 16, textAlign: 'center', lineHeight: 23, marginTop: 6 },
});

const compactStyles = StyleSheet.create({ card: { minHeight: 88, padding: 10 }, imagePlaceholder: { marginRight: 10 }, info: { paddingVertical: 2 }, name: { fontSize: 17 }, detail: { fontSize: 14, lineHeight: 20 } });
