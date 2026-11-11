import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useMedications } from '../../../providers/MedicationProvider';
import { medicines } from '../../Search/medicineData';
import { ScrollView, StyleSheet, View } from 'react-native';
import TodayMedicineItem from './TodayMedicineItem';
import { useEffect, useState } from 'react';

export default function TodayMedicineList() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  const { todayDoses, toggleDose } = useMedications();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(timer); }, []);
  const doses = todayDoses.flatMap(dose => {
    const medicine = medicines.find(item => item.id === dose.medicineId);
    return medicine ? [{ ...dose, title: medicine.name }] : [];
  });
  const completedCount = doses.filter(dose => dose.completed).length;
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const minuteOf = (time: string) => { const [hour, minute] = time.split(':').map(Number); return hour * 60 + minute; };
  const upcoming = doses.filter(dose => !dose.completed && minuteOf(dose.time) >= currentMinute).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  const overdue = doses.filter(dose => !dose.completed && minuteOf(dose.time) < currentMinute).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  const completed = doses.filter(dose => dose.completed).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  return(
    <View style={styles.todayMedicineListContainer}>
      <View style={styles.todayMedicineListHeader}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.todayMedicineListHeaderStatus}>{completedCount}/{doses.length} 완료</Text>
      </View>
      <View style={styles.columns}>
        <View style={styles.pane}>
          <View style={styles.paneHeader}><Text style={styles.paneTitle}>복용 예정</Text><Text style={styles.paneCount}>{upcoming.length + overdue.length}</Text></View>
          <ScrollView style={styles.paneList} contentContainerStyle={styles.paneContent} nestedScrollEnabled directionalLockEnabled showsVerticalScrollIndicator>
            {overdue.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => toggleDose(dose.doseId)} />)}
            {upcoming.length > 0 && overdue.length > 0 && <Text style={styles.groupTitle}>다음 복용</Text>}
            {upcoming.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => toggleDose(dose.doseId)} />)}
            {!upcoming.length && !overdue.length && <Text style={styles.emptyText}>예정된 약이 없습니다.</Text>}
          </ScrollView>
        </View>
        <View style={styles.pane}>
          <View style={styles.paneHeader}><Text style={styles.paneTitle}>복용 완료</Text><Text style={styles.paneCount}>{completed.length}</Text></View>
          <ScrollView style={styles.paneList} contentContainerStyle={styles.paneContent} nestedScrollEnabled directionalLockEnabled showsVerticalScrollIndicator>
            {completed.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => toggleDose(dose.doseId)} />)}
            {!completed.length && <Text style={styles.emptyText}>아직 복용한 약이 없습니다.</Text>}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  groupTitle: { color: '#687386', fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 2 },
  emptyText: { color: '#6B7280', fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  todayMedicineListContainer: { gap: 10, width: '100%' },
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

  columns: { flexDirection: 'row', alignItems: 'stretch', gap: 12, width: '100%' },
  pane: { flex: 1, minWidth: 0, height: 320, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#FAFBFC', padding: 10, gap: 8 },
  paneHeader: { minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2 },
  paneTitle: { color: '#303642', fontSize: 15, fontWeight: '600' },
  paneCount: { color: '#7B8494', fontSize: 13 },
  paneList: { width: '100%', flex: 1, minHeight: 0 },
  paneContent: { gap: 6, paddingBottom: 2 },
});

const compactStyles = StyleSheet.create({
  columns: { flexDirection: 'column' },
  pane: { height: 240 },
});
