import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors } from '../../theme/tokens';
import SkeletonBlock from '../Skeleton/SkeletonBlock';

export default function ProfileOverviewSkeleton() {
  const styles = useResponsiveStyles(baseStyles);

  return (
    <View accessible accessibilityLabel="개인정보 불러오는 중" accessibilityState={{ busy: true }}>
      <View style={styles.hero}>
        <SkeletonBlock style={styles.avatar} />
        <View style={styles.nameRow}><SkeletonBlock style={styles.name} /></View>
        <View style={styles.emailRow}><SkeletonBlock style={styles.email} /></View>
      </View>
      <View style={styles.table}>
        {[0, 1, 2, 3, 4].map(index => (
          <View key={index} style={[styles.row, index > 0 && styles.divider]}>
            <SkeletonBlock style={styles.label} />
            <SkeletonBlock style={styles.value} />
          </View>
        ))}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 22 },
  avatar: { width: 82, height: 82, borderRadius: 41 },
  nameRow: { height: 28, marginTop: 16, justifyContent: 'center' },
  name: { width: 84, height: 18 },
  emailRow: { height: 20, marginTop: 2, justifyContent: 'center' },
  email: { width: 140, height: 12 },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, overflow: 'hidden' },
  row: { minHeight: 46, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  label: { width: 54, height: 14 },
  value: { width: 64, height: 14 },
});
