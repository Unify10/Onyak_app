import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TodayMedicineItem from './TodayMedicineItem';

const schedule = [
  { id: 'morning', title: '123', timeOfDay: '아침', time: '00:00' },
  { id: 'lunch', title: '234', timeOfDay: '점심', time: '12:00' },
  { id: 'dinner', title: '345', timeOfDay: '저녁', time: '24:00' },
] as const;

export default function TodayMedicineList() {
  const styles = useResponsiveStyles(baseStyles);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  function toggle(id: string) {
    setCompletedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }
  return(
    <View style={styles.todayMedicineListContainer}>
      <View style={styles.todayMedicineListHeader}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.todayMedicineListHeaderStatus}>{completedIds.length}/{schedule.length} 완료</Text>
      </View>
      <View style={styles.todayMedicineList}>
        {schedule.map(item => <TodayMedicineItem key={item.id} {...item} completed={completedIds.includes(item.id)} onToggle={() => toggle(item.id)} />)}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
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
    gap: 5,

  },
});