import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';

const summaries = [
  { count: '3개', label: '복용 중' },
  { count: '1개', label: '복용 주의', highlighted: true },
  { count: '2개', label: '복용 기록' },
];

export default function MedicationSummary({ currentCount = 3 }: { currentCount?: number }) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.summary}>
      {summaries.map(({ count, label, highlighted }) => (
        <View key={label} style={[styles.card, highlighted && styles.highlightedCard]}>
          <Text style={styles.count}>{label === '복용 중' ? `${currentCount}개` : count}</Text>
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
