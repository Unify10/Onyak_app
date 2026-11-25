import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';
import Text from '../../Typography/Text';
import { ServerFamilyItemSkeleton } from './ServerFamilyItem';

type Props = { count?: number; loading?: boolean; children?: ReactNode };

export default function FamilyListLayout({ count, loading = false, children }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>가족</Text>
        {loading ? <SkeletonBlock style={styles.countSkeleton} /> : count !== undefined && <Text style={styles.count}>{count}명</Text>}
      </View>
      <View style={styles.list}>
        {loading && <ServerFamilyItemSkeleton />}
        {children}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '100%', gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, color: '#111111' },
  count: { fontSize: 14, color: '#6B7280' },
  countSkeleton: { width: 28, height: 14 },
  list: { gap: 10 },
});
