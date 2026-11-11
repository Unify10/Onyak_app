import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';

const summaries = [
  { key: 'current', label: '복용 중', highlighted: false },
  { key: 'caution', label: '복용 주의', highlighted: true },
  { key: 'records', label: '복용 기록', highlighted: false },
] as const;

export default function MedicationSummary({ currentCount = 0, cautionCount = 0, recordCount = 0 }: { currentCount?: number; cautionCount?: number; recordCount?: number }) {
  const styles = useResponsiveStyles(baseStyles);
  const counts = { current: currentCount, caution: cautionCount, records: recordCount };
  return (
    <View style={styles.summary}>
      {summaries.map(({ key, label, highlighted }) => (
        <View key={key} style={[styles.card, highlighted && styles.highlightedCard]}>
          <Text style={styles.count}>{counts[key]}개</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16, marginBottom: 26 },
  card: { flex: 1, height: 80, borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 3 },
  highlightedCard: { borderColor: '#111111', borderWidth: 1.5 },
  count: { fontSize: 23, color: '#111111' },
  label: { fontSize: 14, color: '#7B8494' },
});
