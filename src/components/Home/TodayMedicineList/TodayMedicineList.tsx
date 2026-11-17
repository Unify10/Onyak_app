import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useMedications } from '../../../providers/MedicationProvider';
import { medicines } from '../../Search/medicineData';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import TodayMedicineItem from './TodayMedicineItem';
import { useEffect, useState } from 'react';

export default function TodayMedicineList() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  const { todayDoses, toggleDose } = useMedications();
  const [now, setNow] = useState(() => new Date());
  const [doseAwaitingConfirmation, setDoseAwaitingConfirmation] = useState<string | null>(null);
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(timer); }, []);
  const doses = todayDoses.flatMap(dose => {
    const medicine = medicines.find(item => item.id === dose.medicineId);
    return medicine ? [{ ...dose, title: medicine.name }] : [];
  });
  const completedCount = doses.filter(dose => dose.completed).length;
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const minuteOf = (time: string) => { const [hour, minute] = time.split(':').map(Number); return hour * 60 + minute; };
  function requestToggle(dose: typeof doses[number]) {
    if (dose.completed) {
      toggleDose(dose.doseId);
      return;
    }
    if (minuteOf(dose.time) > currentMinute) {
      setDoseAwaitingConfirmation(dose.doseId);
      return;
    }
    toggleDose(dose.doseId);
  }
  function confirmEarlyDose() {
    if (doseAwaitingConfirmation) toggleDose(doseAwaitingConfirmation);
    setDoseAwaitingConfirmation(null);
  }
  const upcoming = doses.filter(dose => !dose.completed && minuteOf(dose.time) >= currentMinute).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  const overdue = doses.filter(dose => !dose.completed && minuteOf(dose.time) < currentMinute).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  const completed = doses.filter(dose => dose.completed).sort((a, b) => minuteOf(a.time) - minuteOf(b.time));
  return(
    <View style={styles.todayMedicineListContainer}>
      <Modal
        transparent
        visible={doseAwaitingConfirmation !== null}
        animationType="fade"
        onRequestClose={() => setDoseAwaitingConfirmation(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>복용 시간 확인</Text>
            <Text style={styles.confirmationMessage}>
              설정한 복용 시간 전입니다. 실제로 약을 복용했는지 확인해주세요.
            </Text>
            <View style={styles.confirmationActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDoseAwaitingConfirmation(null)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirmEarlyDose}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>복용 완료</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.todayMedicineListHeader}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.todayMedicineListHeaderStatus}>{completedCount}/{doses.length} 완료</Text>
      </View>
      <View style={styles.columns}>
        <View style={styles.pane}>
          <View style={styles.paneHeader}><Text style={styles.paneTitle}>오늘 복용할 약</Text><Text style={styles.paneCount}>{upcoming.length + overdue.length}</Text></View>
          <ScrollView style={styles.paneList} contentContainerStyle={styles.paneContent} nestedScrollEnabled directionalLockEnabled showsVerticalScrollIndicator>
            {overdue.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => requestToggle(dose)} />)}
            {upcoming.length > 0 && overdue.length > 0 && <Text style={styles.groupTitle}>다음 복용</Text>}
            {upcoming.map(dose => <TodayMedicineItem key={dose.doseId} title={dose.title} timeOfDay={dose.timeOfDay} time={dose.time} completed={dose.completed} onToggle={() => requestToggle(dose)} />)}
            {!upcoming.length && !overdue.length && <Text style={styles.emptyText}>예정된 약이 없습니다.</Text>}
          </ScrollView>
        </View>
        <View style={styles.pane}>
          <View style={styles.paneHeader}><Text style={styles.paneTitle}>오늘 복용한 약</Text><Text style={styles.paneCount}>{completed.length}</Text></View>
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
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  confirmationCard: { width: '100%', maxWidth: 360, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 24, gap: 12 },
  confirmationTitle: { color: '#111827', fontSize: 18, fontWeight: '700' },
  confirmationMessage: { color: '#4B5563', fontSize: 15, lineHeight: 22 },
  confirmationActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 8 },
  cancelButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16 },
  cancelButtonText: { color: '#4B5563', fontSize: 15, fontWeight: '600' },
  confirmButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 10, backgroundColor: '#111111' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
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
