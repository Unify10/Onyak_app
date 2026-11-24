import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import AppText from '../AppText/AppText';

export default function SearchPagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  const styles = useResponsiveStyles(baseStyles);
  return (
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
  );
}

const baseStyles = StyleSheet.create({
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 8, gap: 7 },
  pageArrow: { width: 34, height: 36, alignItems: 'center', justifyContent: 'center' },
  pageNumber: { width: 34, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  pageNumberSelected: { backgroundColor: '#F2F4F7' },
  pageNumberText: { color: '#7E8795', fontSize: 17 },
  pageNumberTextSelected: { color: '#667085', fontWeight: '700' },
});
