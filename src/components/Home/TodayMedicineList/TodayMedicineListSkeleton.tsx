import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { colors } from '../../../theme/tokens';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';
import Text from '../../Typography/Text';
import { compactTodayMedicineListStyles, todayMedicineListStyles } from './todayMedicineListStyles';

const paneTitles = ['오늘 복용할 약', '오늘 복용한 약'];

export default function TodayMedicineListSkeleton() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);

  return (
    <View
      accessible
      accessibilityLabel="오늘의 복용 불러오는 중"
      accessibilityState={{ busy: true }}
      style={styles.todayMedicineListContainer}
    >
      <View style={[styles.todayMedicineListHeader, styles.header]}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <SkeletonBlock style={styles.status} />
      </View>
      <View style={styles.columns}>
        {paneTitles.map(title => (
          <View key={title} style={styles.pane}>
            <View style={styles.paneHeader}>
              <Text style={styles.paneTitle}>{title}</Text>
              <SkeletonBlock style={styles.count} />
            </View>
            <View style={styles.rows}>
              {[0, 1].map(index => (
                <View key={index} style={styles.row}>
                  <SkeletonBlock style={styles.check} />
                  <View style={styles.details}>
                    <SkeletonBlock style={styles.name} />
                    <SkeletonBlock style={styles.time} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  ...todayMedicineListStyles,
  header: { alignItems: 'center' },
  status: { width: 54, height: 14 },
  count: { width: 16, height: 12 },
  rows: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 15, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  check: { width: 35, height: 35, borderRadius: 18 },
  details: { flex: 1, gap: 7 },
  name: { width: '62%', height: 17 },
  time: { width: '38%', height: 14 },
});

const compactStyles = {
  ...compactTodayMedicineListStyles,
  row: { paddingVertical: 8, paddingHorizontal: 12, gap: 12 },
};
