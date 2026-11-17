import MedicationCautionBadge from './MedicationCautionBadge';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors, typography } from '../../theme/tokens';
import type { Medicine } from '../Search/types';
import {
  getLocalDateKey,
  getMedicationScheduleLabel,
  type MedicationSchedule,
} from '../../utils/medicationSchedule';

type Props = { name?: string; medicines: Medicine[]; schedules: MedicationSchedule[]; cautionIds: ReadonlySet<string> };

export default function CurrentMedicationCard({ name, medicines, schedules, cautionIds }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const today = getLocalDateKey(new Date());
  const entries = medicines.flatMap(medicine => {
    const registered = schedules.filter(schedule => schedule.medicineId === medicine.id);
    const active = registered.filter(schedule =>
      (!schedule.startDate || schedule.startDate <= today) &&
      (!schedule.endDate || schedule.endDate >= today),
    );
    if (registered.length > 0 && active.length === 0) return [];
    return [{ medicine, schedules: active.sort((a, b) => a.time.localeCompare(b.time)) }];
  });

  const cautionEntries = entries.filter(({ medicine }) => cautionIds.has(medicine.id));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          {name && <Text style={styles.personName}>{name}님 </Text>}복용 카드
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.group}>
          <Text accessibilityRole="header" style={styles.heading}>현재 복용 중 · {entries.length}개</Text>
          <Text style={styles.body}>
            {entries.length ? entries.map(({ medicine }) => medicine.name).join(', ') : '현재 복용 중인 약·영양제가 없어요.'}
          </Text>
        </View>

        {entries.length > 0 && (
          <View style={styles.group}>
            <Text accessibilityRole="header" style={styles.heading}>복용 횟수와 시간</Text>
            {entries.map(({ medicine, schedules }) => {
              const daily = schedules.length > 0 && schedules.every(schedule => new Set(schedule.daysOfWeek).size === 7);
              const frequency = daily ? `하루 ${schedules.length}회` : schedules.length ? '요일별 복용' : '일정 미설정';

              return (
                <View key={medicine.id} style={styles.scheduleRow}>
                  <View style={styles.rowHeading}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.frequency}>{frequency}</Text>
                  </View>
                  {schedules.length > 0 && (
                    <Text style={styles.schedule}>
                      {daily
                        ? schedules.map(schedule => `${schedule.timeOfDay} ${schedule.time}`).join(' · ')
                        : getMedicationScheduleLabel(schedules, medicine.id)}
                      {schedules.every(schedule => schedule.isExample) ? ' (예시)' : ''}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {cautionEntries.length > 0 && (
          <View style={[styles.group, styles.cautionGroup]}>
            <View style={styles.cautionHeading}>
              <Ionicons name="warning-outline" size={19} color={colors.error} accessible={false} />
              <Text accessibilityRole="header" style={styles.heading}>복용 주의</Text>
            </View>
            {cautionEntries.map(({ medicine }) => (
              <View key={medicine.id} style={styles.cautionRow}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <MedicationCautionBadge />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  card: { width: '95%', alignSelf: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: '#F6F7F9', overflow: 'hidden' },
  header: { paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.sectionTitle, lineHeight: 32 },
  personName: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  content: { padding: 16, gap: 12 },
  group: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, gap: 8 },
  heading: { ...typography.sectionTitle, fontSize: 16 },
  body: { ...typography.body },
  scheduleRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 8, gap: 4 },
  rowHeading: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  medicineName: { color: colors.ink, fontSize: 15, lineHeight: 22, fontWeight: '600', maxWidth: '100%' },
  frequency: { ...typography.caption, color: colors.ink, fontWeight: '600', backgroundColor: '#F2F4F7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  schedule: { ...typography.caption, color: colors.body },
  cautionGroup: { borderWidth: 1, borderColor: colors.error, backgroundColor: '#FEF6F5' },
  cautionHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cautionRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
});
