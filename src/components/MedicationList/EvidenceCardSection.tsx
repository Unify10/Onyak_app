import { Pressable, StyleSheet, View } from 'react-native';
import type { EvidenceCard } from '../../api/evidenceCard';
import type { useWardEvidenceCard } from '../../hooks/useWardEvidenceCard';
import { colors, typography } from '../../theme/tokens';
import { formatEvidenceCardDate, getEvidenceCardSections } from '../../utils/evidenceCard';
import QueryError from '../Feedback/QueryError';
import SkeletonBlock from '../Skeleton/SkeletonBlock';
import Text from '../Typography/Text';

type EvidenceRequest = ReturnType<typeof useWardEvidenceCard>;

export function EvidenceCardFeedback({ request }: { request: EvidenceRequest }) {
  if (request.state.status === 'error') {
    return <QueryError message={request.state.message} onRetry={request.retry} />;
  }
  if (request.state.status === 'ready') return null;
  return (
    <View accessible accessibilityLabel="복약 확인 근거 카드 불러오는 중" accessibilityState={{ busy: true }} style={styles.panel}>
      <SkeletonBlock style={styles.titleSkeleton} />
      <SkeletonBlock style={styles.contentSkeleton} />
    </View>
  );
}

export default function EvidenceCardSection({ card, onRefresh }: { card: EvidenceCard; onRefresh?: () => void }) {
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.title}>복약 확인 근거 카드</Text>
      <Text style={styles.detail}>점검 시각 {formatEvidenceCardDate(card.generated_at)}</Text>
      <Text style={[styles.headline, card.level === 'DANGER' && styles.danger, card.level === 'CAUTION' && styles.caution]}>{card.headline}</Text>
      {getEvidenceCardSections(card).map(({ title, lines }, index) => (
        <View key={`${index}-${title}`} style={styles.item}>
          <Text style={styles.itemTitle}>{title}</Text>
          {lines.map((line, index) => line && <Text key={index} style={styles.detail}>{line}</Text>)}
        </View>
      ))}
      {card.disclaimer && <Text style={styles.detail}>{card.disclaimer}</Text>}
      {onRefresh && (
        <Pressable accessibilityRole="button" onPress={onRefresh} style={styles.button}>
          <Text style={styles.itemTitle}>복약 점검 다시 조회</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, backgroundColor: colors.surface, gap: 8 },
  title: { ...typography.sectionTitle, fontSize: 16 },
  detail: { ...typography.caption, color: colors.body },
  headline: { ...typography.body, backgroundColor: '#F2F4F7', borderRadius: 10, padding: 10 },
  danger: { color: '#B42318', backgroundColor: '#FFF1F0' },
  caution: { color: '#854A0E', backgroundColor: '#FFF5DB' },
  item: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingTop: 8, gap: 4 },
  itemTitle: { ...typography.body, color: colors.ink },
  button: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
  titleSkeleton: { width: '50%', height: 18 },
  contentSkeleton: { width: '100%', height: 46 },
});
