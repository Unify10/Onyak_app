import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useWardEvidenceCard } from '../../hooks/useWardEvidenceCard';
import { colors, typography } from '../../theme/tokens';
import EvidenceCardSection, { EvidenceCardFeedback } from '../MedicationList/EvidenceCardSection';
import Text from '../Typography/Text';

export default function WardEvidenceCard({ wardId, revision }: { wardId: string; revision: number }) {
  const [open, setOpen] = useState(false);
  const request = useWardEvidenceCard(open ? wardId : undefined, 'guardian', revision);
  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(value => !value)} style={styles.button}>
        <Text style={styles.label}>{open ? '복약 확인 근거 카드 닫기' : '복약 확인 근거 카드 보기'}</Text>
      </Pressable>
      {open && (request.state.status === 'ready'
        ? <EvidenceCardSection card={request.state.data} onRefresh={request.retry} />
        : <EvidenceCardFeedback request={request} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  button: { minHeight: 44, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  label: { ...typography.body, color: colors.ink },
});
