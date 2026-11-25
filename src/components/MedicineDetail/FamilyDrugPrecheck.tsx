import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getFamilyList, type FamilySummary } from '../../api/family';
import { useWardMedicationPrecheck } from '../../hooks/useWardMedicationPrecheck';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import QueryError from '../Feedback/QueryError';
import Text from '../Typography/Text';
import MedicationPrecheckResult from './MedicationPrecheckResult';

type Props = { drugId: string; onClose: () => void };

export default function FamilyDrugPrecheck({ drugId, onClose }: Props) {
  const [family, setFamily] = useState<FamilySummary | null>(null);
  const familyList = useProtectedQuery(getFamilyList);

  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={styles.title}>가족 복용 전 점검</Text>
      {family ? (
        <FamilyCheck key={family.ward_id} family={family} drugId={drugId} />
      ) : (
        <>
          <Text>점검할 피보호자를 선택해 주세요.</Text>
          {familyList.state.status === 'loading' && <Text accessibilityLiveRegion="polite">가족 목록을 불러오는 중이에요.</Text>}
          {familyList.state.status === 'error' && <QueryError message={familyList.state.message} onRetry={familyList.retry} />}
          {familyList.state.status === 'ready' && (
            familyList.state.data.length === 0 ? <Text>등록된 피보호자가 없어요.</Text> : familyList.state.data.map(member => (
              <Pressable key={member.ward_id} accessibilityRole="button" style={styles.option} onPress={() => setFamily(member)}>
                <Text style={styles.buttonText}>{member.name}</Text>
              </Pressable>
            ))
          )}
        </>
      )}
      {family && (
        <Pressable accessibilityRole="button" style={styles.action} onPress={() => setFamily(null)}>
          <Text style={styles.buttonText}>다른 피보호자 선택</Text>
        </Pressable>
      )}
      <Pressable accessibilityRole="button" accessibilityLabel="복용 전 점검 닫기" style={styles.action} onPress={onClose}>
        <Text style={styles.buttonText}>닫기</Text>
      </Pressable>
    </View>
  );
}

function FamilyCheck({ family, drugId }: { family: FamilySummary; drugId: string }) {
  const { state, retry } = useWardMedicationPrecheck(family.ward_id, drugId);

  return (
    <>
      <Text style={styles.subject}>{family.name}님의 점검 결과</Text>
      {state.status === 'loading' && <Text accessibilityLiveRegion="polite">복용 전 점검 중이에요.</Text>}
      {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {state.status === 'ready' && <MedicationPrecheckResult result={state.data} onRetry={retry} />}
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12 },
  title: { color: '#171C26', fontSize: 20, fontWeight: '700' },
  subject: { color: '#344054', fontSize: 16, fontWeight: '600' },
  option: { minHeight: 48, paddingHorizontal: 14, borderWidth: 1, borderColor: '#D6DAE0', borderRadius: 12, justifyContent: 'center' },
  buttonText: { fontWeight: '400' },
  action: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
