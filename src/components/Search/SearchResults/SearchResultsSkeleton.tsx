import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { colors, medicineImageLayout } from '../../../theme/tokens';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';

export default function SearchResultsSkeleton() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);

  return (
    <View accessible accessibilityLabel="검색 결과 불러오는 중" accessibilityState={{ busy: true }}>
      <SkeletonBlock style={styles.heading} />
      {[0, 1, 2].map(index => (
        <View key={index} style={styles.card}>
          <SkeletonBlock style={[medicineImageLayout, styles.image]} />
          <View style={styles.details}>
            <SkeletonBlock style={styles.name} />
            <SkeletonBlock style={styles.ingredient} />
          </View>
        </View>
      ))}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  heading: { width: 98, height: 16, marginTop: 4, marginBottom: 14 },
  card: { minHeight: 111, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 12, marginBottom: 11, borderWidth: 1, borderColor: colors.border, borderRadius: 17 },
  image: { borderRadius: 13 },
  details: { flex: 1, gap: 9 },
  name: { width: '62%', height: 16 },
  ingredient: { width: '78%', height: 13 },
});

const compactStyles = { card: { minHeight: 88, gap: 10, padding: 10 } };
