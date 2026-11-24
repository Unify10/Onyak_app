import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors } from '../../theme/tokens';
import SkeletonBlock from './SkeletonBlock';

type Props = {
  label: string;
  kind: 'app' | 'medicine' | 'family';
  header?: ReactNode;
};

export default function DetailSkeleton({ label, kind, header }: Props) {
  const styles = useResponsiveStyles(baseStyles);

  return (
    <View style={styles.screen}>
      {header ? <View style={styles.header}>{header}</View> : null}
      <View accessible accessibilityLabel={label} accessibilityState={{ busy: true }} style={styles.content}>
        {kind === 'medicine' && <SkeletonBlock style={styles.image} />}
        <SkeletonBlock style={[styles.title, kind === 'medicine' && styles.centered]} />
        {kind === 'family' && (
          <>
            <SkeletonBlock style={styles.subtitle} />
            <View style={styles.summary}>
              <SkeletonBlock style={styles.summaryCard} />
              <SkeletonBlock style={styles.summaryCard} />
            </View>
            <SkeletonBlock style={styles.calendar} />
          </>
        )}
        {kind !== 'family' && [0, 1, 2].map(index => <SkeletonBlock key={index} style={styles.row} />)}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 20, gap: 14 },
  title: { width: '42%', height: 24, marginBottom: 6 },
  centered: { alignSelf: 'center', marginBottom: 34 },
  subtitle: { width: '68%', height: 15 },
  image: { width: 150, height: 150, borderRadius: 8, alignSelf: 'center' },
  row: { height: 56, borderRadius: 12, width: '100%' },
  summary: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, height: 98, borderRadius: 16 },
  calendar: { height: 280, borderRadius: 16 },
});
