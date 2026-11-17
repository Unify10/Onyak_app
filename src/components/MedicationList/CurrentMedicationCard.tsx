import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import type { Medicine } from '../Search/types';
import {
  getLocalDateKey,
  getMedicationScheduleLabel,
  type MedicationSchedule,
} from '../../utils/medicationSchedule';

type Props = { medicines: Medicine[]; schedules: MedicationSchedule[] };

export default function CurrentMedicationCard({ medicines, schedules }: Props) {
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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>현재 복용 중</Text>
        <Text style={styles.count}>{entries.length}개</Text>
      </View>
      {entries.length === 0 && <Text style={styles.empty}>현재 복용 중인 약·영양제가 없어요.</Text>}
      {entries.map(({ medicine, schedules }) => (
        <View key={medicine.id} style={styles.row}>
          <View style={[styles.icon, medicine.category === '영양제' && styles.supplementIcon]}>
            <Ionicons
              name={medicine.category === '영양제' ? 'leaf-outline' : 'medkit-outline'}
              size={22}
              color={medicine.category === '영양제' ? '#66501D' : '#245B55'}
              accessible={false}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{medicine.name}</Text>
            <Text style={styles.category}>{medicine.category}</Text>
            {schedules.length > 0 ? (
              <View style={styles.schedules}>
                {schedules.map(schedule => (
                  <Text key={schedule.id} style={styles.schedule}>
                    {getMedicationScheduleLabel([schedule], medicine.id)}
                    {schedule.isExample ? ' (예시)' : ''}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.category}>복용 일정 미설정</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 560, alignSelf: 'center', borderWidth: 1, borderColor: '#DDE6E4', borderRadius: 20, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, padding: 18, backgroundColor: '#F1F7F5', borderTopLeftRadius: 19, borderTopRightRadius: 19 },
  title: { color: '#173E39', fontSize: 20, fontWeight: '700' },
  count: { color: '#245B55', fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DDE6E4' },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E4F2EE', alignItems: 'center', justifyContent: 'center' },
  supplementIcon: { backgroundColor: '#FBF2D9' },
  details: { flex: 1, minWidth: 0, gap: 4 },
  name: { color: '#151B1A', fontSize: 17, lineHeight: 24, fontWeight: '600' },
  category: { color: '#515E5D', fontSize: 14, lineHeight: 20 },
  schedules: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  schedule: { maxWidth: '100%', backgroundColor: '#EFF5F3', color: '#254842', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5, fontSize: 14, lineHeight: 20 },
  empty: { color: '#515E5D', fontSize: 15, textAlign: 'center', padding: 24 },
});
