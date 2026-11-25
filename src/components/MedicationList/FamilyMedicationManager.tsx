import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import type { FamilyMedication } from '../../api/family';
import { deleteFamilyMedication, getFamilyMedication, getFamilyMedicationSchedule, updateFamilyMedication, updateFamilyMedicationSchedule, type MedicationOptions } from '../../api/medications';
import { useMedicationMutation } from '../../hooks/useMedicationMutation';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import ConfirmationDialog from '../Dialogs/ConfirmationDialog';
import QueryError from '../Feedback/QueryError';
import SkeletonBlock from '../Skeleton/SkeletonBlock';
import Text from '../Typography/Text';

type Props = {
  records: FamilyMedication[];
  role: 'guardian' | 'dependent';
  onChanged: () => void;
};

type Action = 'stop' | 'resume' | 'delete';
const actionLabels: Record<Action, string> = { stop: '복용 중단', resume: '복용 재개', delete: '약 삭제' };

export default function FamilyMedicationManager({ records, role, onChanged }: Props) {
  const [editing, setEditing] = useState<{ id: number; kind: 'schedule' | 'dosage' | 'details' }>();
  const [pending, setPending] = useState<{ medication: FamilyMedication; action: Action }>();
  const mutation = useMedicationMutation();
  const canManage = role === 'guardian';

  function ask(medication: FamilyMedication, action: Action) {
    mutation.clearError();
    setPending({ medication, action });
  }

  async function applyAction() {
    if (!pending) return;
    const { medication, action } = pending;
    setPending(undefined);
    const saved = await mutation.run((token, signal) => action === 'delete'
      ? deleteFamilyMedication(medication.medication_id, token, signal)
      : updateFamilyMedication(medication.medication_id, { active: action === 'resume' }, token, signal));
    if (saved) onChanged();
  }

  function finishEditing() {
    setEditing(undefined);
    onChanged();
  }

  return (
    <View style={styles.list}>
      {mutation.error && <Text accessibilityRole="alert" style={styles.error}>{mutation.error}</Text>}
      {records.map(medication => (
        <View key={medication.medication_id} style={styles.card}>
          <Text style={styles.name}>{medication.drug_name}</Text>
          {!!medication.dosage && <Text style={styles.secondary}>복용량 {medication.dosage}</Text>}
          {!!medication.schedule_times.length && <Text style={styles.secondary}>{medication.schedule_times.join(' · ')}</Text>}
          {!!medication.start_date && <Text style={styles.secondary}>{medication.start_date}{medication.end_date ? ` ~ ${medication.end_date}` : '부터'}</Text>}
          {!editing && <View style={styles.actions}>
            <ActionButton label="복용 정보" disabled={mutation.busy} onPress={() => setEditing({ id: medication.medication_id, kind: 'details' })} />
            {medication.active && <ActionButton label="일정·알림 설정" disabled={mutation.busy} onPress={() => setEditing({ id: medication.medication_id, kind: 'schedule' })} />}
            {canManage && medication.active && <ActionButton label="복용량 수정" disabled={mutation.busy} onPress={() => setEditing({ id: medication.medication_id, kind: 'dosage' })} />}
            {canManage && <ActionButton label={actionLabels[medication.active ? 'stop' : 'resume']} disabled={mutation.busy} onPress={() => ask(medication, medication.active ? 'stop' : 'resume')} />}
            {canManage && <ActionButton label={actionLabels.delete} danger disabled={mutation.busy} onPress={() => ask(medication, 'delete')} />}
          </View>}
          {editing?.id === medication.medication_id && (editing.kind === 'schedule'
            ? <ScheduleEditor medicationId={editing.id} role={role} onSave={finishEditing} onCancel={() => setEditing(undefined)} />
            : editing.kind === 'details'
              ? <MedicationDetails medicationId={editing.id} role={role} onClose={() => setEditing(undefined)} />
              : <DosageEditor medication={medication} onSave={finishEditing} onCancel={() => setEditing(undefined)} />)}
        </View>
      ))}
      {pending && (
        <ConfirmationDialog
          visible
          title={pending.action === 'delete'
            ? `${pending.medication.drug_name}을(를) 삭제할까요? 이 약의 복약 기록도 함께 삭제돼요.`
            : `${pending.medication.drug_name}의 복용을 ${pending.action === 'stop' ? '중단' : '재개'}할까요?`}
          confirmLabel={actionLabels[pending.action]}
          onCancel={() => setPending(undefined)}
          onConfirm={() => void applyAction()}
        />
      )}
    </View>
  );
}

type EditorProps = { onSave: () => void; onCancel: () => void };

function MedicationDetails({ medicationId, role, onClose }: {
  medicationId: number;
  role: Props['role'];
  onClose: () => void;
}) {
  const query = useCallback((token: string, signal: AbortSignal) => getFamilyMedication(medicationId, token, signal), [medicationId]);
  const { state, retry } = useProtectedQuery(query, true, role);
  return (
    <View style={styles.editor}>
      {state.status === 'loading' && <SkeletonBlock style={styles.loading} />}
      {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {state.status === 'ready' && (
        <>
          <Text style={styles.name}>{state.data.active ? '현재 복용 중' : '복용 중단됨'}</Text>
          <Text style={styles.secondary}>성분 {state.data.ingredients?.join(' · ') || '정보 없음'}</Text>
          <Text style={styles.secondary}>복용 일정 {state.data.schedule_times.join(' · ') || '미설정'}</Text>
          <Text style={styles.secondary}>복용 알림 {state.data.push_enabled ? '켜짐' : '꺼짐'}</Text>
        </>
      )}
      <ActionButton label="닫기" onPress={onClose} />
    </View>
  );
}

function ScheduleEditor({ medicationId, role, onSave, onCancel }: EditorProps & { medicationId: number; role: Props['role'] }) {
  const query = useCallback((token: string, signal: AbortSignal) => getFamilyMedicationSchedule(medicationId, token, signal), [medicationId]);
  const { state, retry } = useProtectedQuery(query, true, role);
  if (state.status === 'ready') return <ScheduleForm medicationId={medicationId} schedule={state.data} onSave={onSave} onCancel={onCancel} />;
  return (
    <View style={styles.editor}>
      {state.status === 'error' ? <QueryError message={state.message} onRetry={retry} /> : <SkeletonBlock style={styles.loading} />}
      <ActionButton label="취소" onPress={onCancel} />
    </View>
  );
}

function ScheduleForm({ medicationId, schedule, onSave, onCancel }: EditorProps & { medicationId: number; schedule: MedicationOptions }) {
  const [times, setTimes] = useState(schedule.schedule_times.join(', '));
  const [reminders, setReminders] = useState(schedule.push_enabled);
  const [validation, setValidation] = useState<string>();
  const mutation = useMedicationMutation();

  async function save() {
    const scheduleTimes = times.trim() ? times.split(',').map(time => time.trim()) : [];
    if (scheduleTimes.length > 12 || new Set(scheduleTimes).size !== scheduleTimes.length
      || scheduleTimes.some(time => !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))) {
      setValidation('복용 시각을 08:00, 19:30처럼 중복 없이 최대 12개까지 입력해주세요.');
      return;
    }
    setValidation(undefined);
    const saved = await mutation.run((token, signal) => updateFamilyMedicationSchedule(
      medicationId, { schedule_times: scheduleTimes.sort(), push_enabled: reminders }, token, signal,
    ));
    if (saved) onSave();
  }

  return (
    <View style={styles.editor}>
      <Text style={styles.name}>일정·알림 설정</Text>
      <Text style={styles.secondary}>시각을 쉼표로 구분해주세요. 비워 두면 일정이 해제돼요.</Text>
      <TextInput accessibilityLabel="복용 시각" value={times} onChangeText={value => { setTimes(value); setValidation(undefined); }} placeholder="08:00, 19:30" style={styles.input} autoCorrect={false} editable={!mutation.busy} />
      <View style={styles.switchRow}>
        <Text>복용 알림</Text>
        <Switch accessibilityLabel="복용 알림" value={reminders} onValueChange={setReminders} disabled={mutation.busy} />
      </View>
      <EditorActions error={validation || mutation.error} busy={mutation.busy} onSave={() => void save()} onCancel={onCancel} />
    </View>
  );
}

function DosageEditor({ medication, onSave, onCancel }: EditorProps & { medication: FamilyMedication }) {
  const [dosage, setDosage] = useState(medication.dosage ?? '');
  const mutation = useMedicationMutation();
  async function save() {
    if (await mutation.run((token, signal) => updateFamilyMedication(medication.medication_id, { dosage: dosage.trim() }, token, signal))) onSave();
  }
  return (
    <View style={styles.editor}>
      <Text style={styles.name}>복용량 수정</Text>
      <TextInput accessibilityLabel="복용량" value={dosage} onChangeText={setDosage} editable={!mutation.busy} maxLength={100} style={styles.input} />
      <EditorActions error={mutation.error} busy={mutation.busy} canSave={!!dosage.trim()} onSave={() => void save()} onCancel={onCancel} />
    </View>
  );
}

function EditorActions({ error, busy, canSave = true, onSave, onCancel }: EditorProps & { error?: string; busy: boolean; canSave?: boolean }) {
  return (
    <>
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <ActionButton label="취소" disabled={busy} onPress={onCancel} />
        <ActionButton label={busy ? '저장 중' : '저장'} disabled={busy || !canSave} onPress={onSave} />
      </View>
    </>
  );
}

function ActionButton({ label, disabled, danger, onPress }: { label: string; disabled?: boolean; danger?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled]}><Text style={[styles.buttonLabel, danger && styles.error]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: { borderWidth: 1, borderColor: '#E1E4E8', borderRadius: 14, padding: 14, gap: 6 },
  name: { fontSize: 16, color: '#111111' },
  secondary: { fontSize: 14, color: '#667085' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  button: { minHeight: 44, backgroundColor: '#F4F5F7', paddingHorizontal: 12, borderRadius: 10, justifyContent: 'center' },
  buttonLabel: { fontSize: 14, color: '#111111' },
  disabled: { opacity: 0.5 },
  error: { color: '#B42318' },
  editor: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E1E4E8', paddingTop: 12, gap: 10, marginTop: 6 },
  input: { minHeight: 44, paddingHorizontal: 10, borderWidth: 1, borderColor: '#98A2B3', borderRadius: 8, color: '#111111' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  loading: { height: 44, width: '100%' },
});
