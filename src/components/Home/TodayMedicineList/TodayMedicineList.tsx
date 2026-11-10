import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useMedications } from '../../../providers/MedicationProvider';
import { medicines } from '../../Search/medicineData';
import { ScrollView, StyleSheet, View } from 'react-native';
import TodayMedicineItem from './TodayMedicineItem';

export default function TodayMedicineList() {
  const styles = useResponsiveStyles(baseStyles);
  const { todayDoses, toggleDose } = useMedications();
  const doses = todayDoses.flatMap(dose => {
    const medicine = medicines.find(item => item.id === dose.medicineId);
    return medicine ? [{ ...dose, title: medicine.name }] : [];
  });
  const completedCount = doses.filter(dose => dose.completed).length;
  return(
    <View style={styles.todayMedicineListContainer}>
      <View style={styles.todayMedicineListHeader}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.todayMedicineListHeaderStatus}>{completedCount}/{doses.length} 완료</Text>
      </View>
      {doses.some(dose => dose.isExample) && <Text style={styles.exampleNotice}>테스트용 복용 일정입니다.</Text>}
      <ScrollView
        style={styles.todayMedicineList}
        contentContainerStyle={styles.todayMedicineListContent}
        nestedScrollEnabled
        directionalLockEnabled
        showsVerticalScrollIndicator
      >
        {doses.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => toggleDose(dose.doseId)} />)}
        {!doses.length && <Text style={styles.emptyText}>오늘 예정된 복용이 없습니다.</Text>}
      </ScrollView>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  exampleNotice: { color: '#9CA3AF', fontSize: 12, lineHeight: 18 },
  emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  todayMedicineListContainer: {
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',

  },
  todayMedicineListHeader:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
  },
  todayMedicineListHeaderTitle: {
    fontSize: 20,

  },
  todayMedicineListHeaderStatus: {
    fontSize: 16,
    color: '#6B7280',
  },

  todayMedicineList: {
    width: '100%',
    maxHeight: 260,
    flexGrow: 0,
  },
  todayMedicineListContent: {
    gap: 5,
  },
});
