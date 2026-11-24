import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { colors, medicineImageLayout } from '../../../theme/tokens';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';

type Props = { showCard: boolean };

export default function MedicationListSkeleton({ showCard }: Props) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);

  return (
    <View accessible accessibilityLabel="복용 목록 불러오는 중" accessibilityState={{ busy: true }} style={styles.list}>
      {showCard ? (
        <View style={styles.summary}>
          <SkeletonBlock style={styles.summaryTitle} />
          {[0, 1, 2].map(index => <SkeletonBlock key={index} style={styles.summarySection} />)}
        </View>
      ) : (
        [0, 1, 2].map(index => (
          <View key={index} style={styles.card}>
            <SkeletonBlock style={[medicineImageLayout, styles.image]} />
            <View style={styles.details}>
              <SkeletonBlock style={styles.name} />
              <SkeletonBlock style={styles.schedule} />
              <SkeletonBlock style={styles.date} />
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  list: { gap: 16 },
  card: { minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 16 },
  image: { borderRadius: 12 },
  details: { flex: 1, gap: 7 },
  name: { width: '60%', height: 16 },
  schedule: { width: '77%', height: 13 },
  date: { width: '48%', height: 12 },
  summary: { width: '95%', alignSelf: 'center', gap: 12, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 24 },
  summaryTitle: { width: '50%', height: 24, marginBottom: 6 },
  summarySection: { width: '100%', height: 54, borderRadius: 16 },
});

const compactStyles = { card: { minHeight: 92, gap: 10, padding: 12 }, details: { gap: 5 } };
