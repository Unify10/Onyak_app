import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';
import TextInput from '../Typography/TextInput';
import BirthDateField from '../PersonalInfo/BirthDateField';
import TimeWheelPicker from './TimeWheelPicker';
import {
  addDaysToDateKey,
  formatDateKey,
  getLocalDateKey,
  isValidDateKey,
  type DoseTimeOfDay,
  type MedicationSchedule,
} from '../../utils/medicationSchedule';

type DoseTimeInput = { timeOfDay: DoseTimeOfDay; time: string };
type Props = {
  initialSchedules: MedicationSchedule[];
  onSave: (schedule: { startDate: string; durationDays: number; doses: DoseTimeInput[] }) => void;
  onCancel: () => void;
};

const timeOfDayOptions: DoseTimeOfDay[] = ['아침', '점심', '저녁', '취침 전'];
const defaultTimes: Record<DoseTimeOfDay, string> = {
  아침: '08:00',
  점심: '12:00',
  저녁: '18:00',
  '취침 전': '22:00',
  공복: '07:00',
  '식사와 관계 없이': '08:00',
};

function getInitialDuration(schedules: MedicationSchedule[]) {
  const schedule = schedules.find(item => item.startDate && item.endDate);
  if (!schedule?.startDate || !schedule.endDate) return '7';
  const [startYear, startMonth, startDay] = schedule.startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = schedule.endDate.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  return String(Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
}

export default function MedicationScheduleForm({ initialSchedules, onSave, onCancel }: Props) {
  const [startDate, setStartDate] = useState(initialSchedules[0]?.startDate ?? getLocalDateKey(new Date()));
  const [durationDays, setDurationDays] = useState(() => getInitialDuration(initialSchedules));
  const [selectedTimes, setSelectedTimes] = useState<DoseTimeOfDay[]>(() =>
    initialSchedules.length ? [...new Set(initialSchedules.map(item => item.timeOfDay))] : ['아침'],
  );
  const [times, setTimes] = useState<Record<DoseTimeOfDay, string>>(() => ({
    ...defaultTimes,
    ...Object.fromEntries(initialSchedules.map(item => [item.timeOfDay, item.time])),
  }));
  const [error, setError] = useState('');
  const parsedDuration = Number(durationDays);
  const isStartDateValid = isValidDateKey(startDate);
  const isDurationValid = Number.isInteger(parsedDuration) && parsedDuration >= 1 && parsedDuration <= 365;
  const endDate = isStartDateValid && isDurationValid ? addDaysToDateKey(startDate, parsedDuration - 1) : null;

  function toggleTimeOfDay(option: DoseTimeOfDay) {
    setSelectedTimes(current => current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option]);
    setError('');
  }

  function save() {
    if (!isStartDateValid) {
      setError('복용 시작일을 YYYY-MM-DD 형식으로 입력해 주세요.');
      return;
    }
    if (!isDurationValid) {
      setError('복용 기간은 1일에서 365일 사이로 입력해 주세요.');
      return;
    }
    if (!selectedTimes.length) {
      setError('복용 시간대를 하나 이상 선택해 주세요.');
      return;
    }
    const doses = selectedTimes.map(timeOfDay => ({ timeOfDay, time: times[timeOfDay].trim() }));
    if (doses.some(dose => !/^([01]\d|2[0-3]):[0-5]\d$/.test(dose.time))) {
      setError('시간을 24시간제 HH:MM 형식으로 입력해 주세요.');
      return;
    }
    onSave({ startDate, durationDays: parsedDuration, doses });
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>복용 일정 설정</Text>
      <Text style={styles.label}>복용 시작일</Text>
      <BirthDateField label="복용 시작일" value={startDate} onChange={value => { setStartDate(value); setError(''); }} />

      <Text style={styles.label}>복용 기간</Text>
      <View style={styles.durationRow}>
        <TextInput
          accessibilityLabel="복용 기간 일수"
          value={durationDays}
          onChangeText={value => { setDurationDays(value.replace(/\D/g, '').slice(0, 3)); setError(''); }}
          placeholder="7"
          keyboardType="number-pad"
          maxLength={3}
          style={[styles.input, styles.durationInput]}
        />
        <Text style={styles.daysUnit}>일</Text>
        {endDate && <Text style={styles.endDate}>종료일 {formatDateKey(endDate)}</Text>}
      </View>

      <Text style={styles.label}>복용 시간대</Text>
      <View style={styles.options}>
        {timeOfDayOptions.map(option => {
          const selected = selectedTimes.includes(option);
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => toggleTimeOfDay(option)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedTimes.map(timeOfDay => (
        <View key={timeOfDay} style={styles.timeRow}>
          <Text style={styles.timeLabel}>{timeOfDay}</Text>
          <TimeWheelPicker accessibilityLabel={`${timeOfDay} 복용 시간`} value={times[timeOfDay]} onChange={value => { setTimes(current => ({ ...current, [timeOfDay]: value })); setError(''); }} />
        </View>
      ))}

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

      <Pressable accessibilityRole="button" onPress={save} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>일정 저장</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>취소</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { padding: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '600', color: '#111111', marginBottom: 18 },
  label: { fontSize: 15, lineHeight: 21, fontWeight: '600', color: '#303642', marginTop: 12, marginBottom: 8 },
  input: { minHeight: 46, borderWidth: 1, borderColor: '#D9DEE5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#171C26', fontSize: 16, backgroundColor: '#FFFFFF' },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  durationInput: { width: 86, textAlign: 'center' },
  daysUnit: { color: '#303642', fontSize: 16 },
  endDate: { flex: 1, color: '#758093', fontSize: 14, textAlign: 'right' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#D9DEE5', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  optionSelected: { borderColor: '#111111', backgroundColor: '#111111' },
  optionText: { fontSize: 14, color: '#596273' },
  optionTextSelected: { color: '#FFFFFF' },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 12 },
  timeLabel: { color: '#303642', fontSize: 15 },
  error: { color: '#C0392B', fontSize: 13, lineHeight: 19, marginTop: 8 },
  saveButton: { minHeight: 50, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16 },
  cancelButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  cancelButtonText: { color: '#667085', fontSize: 15 },
});
