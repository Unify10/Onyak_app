import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getFamilyList, type FamilySummary } from '../../api/family';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import QueryError from '../Feedback/QueryError';
import Text from '../Typography/Text';
import MedicationScheduleForm, { type FamilyScheduleInput } from './MedicationScheduleForm';

type Props = {
  busy: boolean;
  saveError?: string;
  onCancel: () => void;
  onCreateFamily: () => void;
  onSave: (family: FamilySummary, schedule: FamilyScheduleInput) => void;
};

export default function FamilyMedicationRegistration({ busy, saveError, onCancel, onCreateFamily, onSave }: Props) {
  const [selected, setSelected] = useState<FamilySummary | null>(null);
  const { state, retry } = useProtectedQuery(getFamilyList);

  if (selected) {
    return (
      <>
        <Text style={styles.subject}>{selected.name}님의 복용 일정</Text>
        <MedicationScheduleForm mode="family" busy={busy} saveError={saveError} onCancel={onCancel}
          onSave={schedule => onSave(selected, schedule)} />
      </>
    );
  }

  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={styles.heading}>약을 추가할 가족 선택</Text>
      {state.status === 'loading' && <Text accessibilityLiveRegion="polite">가족 목록을 불러오는 중이에요.</Text>}
      {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {state.status === 'ready' && (
        state.data.length > 0 ? state.data.map(family => (
          <Pressable key={family.ward_id} accessibilityRole="button" style={styles.option} onPress={() => setSelected(family)}>
            <Text style={styles.buttonText}>{family.name}</Text>
          </Pressable>
        )) : (
          <>
            <Text>등록된 가족 계정이 없어요.</Text>
            <Pressable accessibilityRole="button" style={styles.option} onPress={onCreateFamily}>
              <Text style={styles.buttonText}>가족 계정 생성</Text>
            </Pressable>
          </>
        )
      )}
      <Pressable accessibilityRole="button" style={styles.cancel} onPress={onCancel}>
        <Text style={styles.buttonText}>취소</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 10 },
  heading: { fontSize: 19, fontWeight: '600', color: '#111111' },
  subject: { paddingHorizontal: 20, paddingTop: 18, fontSize: 16, fontWeight: '600', color: '#111111' },
  option: { minHeight: 48, padding: 12, justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  buttonText: { color: '#111111', fontSize: 16, fontWeight: '400' },
  cancel: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
});
