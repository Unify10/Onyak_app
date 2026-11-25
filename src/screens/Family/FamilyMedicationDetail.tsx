import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FamilyMedicationOverview from '../../components/Family/FamilyMedicationOverview';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';
import { useMedications } from '../../providers/MedicationContext';
import { needsMedicationCaution } from '../../utils/medicationCaution';
import { getLocalDateKey, getTodayDoses } from '../../utils/medicationSchedule';

export default function FamilyMedicationDetail() {
  const styles = useResponsiveStyles(baseStyles);
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
  const { families } = useFamilies();
  const { medicines } = useMedications();
  const family = families.find(item => item.id === id);
  if (!family) return <View style={styles.screen}><Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/family')}><Ionicons name="chevron-back" size={22} /><Text>가족 목록</Text></Pressable><Text style={styles.empty}>가족 정보를 찾을 수 없습니다.</Text></View>;

  const schedules = family.medicationSchedules ?? [];
  const medicineIds = [...new Set(schedules.map(schedule => schedule.medicineId))];
  const todayKey = getLocalDateKey(new Date());
  const activeIds = new Set(schedules.filter(schedule =>
    (!schedule.startDate || schedule.startDate <= todayKey) &&
    (!schedule.endDate || schedule.endDate >= todayKey),
  ).map(schedule => schedule.medicineId));
  const cautionIds = new Set(medicines.filter(medicine =>
    medicineIds.includes(medicine.id) && needsMedicationCaution(medicine.contraindications, family.details),
  ).map(medicine => medicine.id));
  const cautionCount = [...activeIds].filter(id => cautionIds.has(id)).length;
  return (
    <FamilyMedicationOverview
      profile={family.details}
      initialDate={date}
      schedule={{
        activeCount: activeIds.size,
        cautionCount,
        getDoses: selectedDate => getTodayDoses(medicineIds, schedules, selectedDate).map(dose => ({
          id: dose.doseId,
          name: medicines.find(medicine => medicine.id === dose.medicineId)?.name ?? '등록된 약',
          time: `${dose.timeOfDay} · ${dose.time}`,
          caution: cautionIds.has(dose.medicineId),
        })),
      }}
    />
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  backButton: { minWidth: 42, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 },
  empty: { padding: 24, color: '#667085' },
});
