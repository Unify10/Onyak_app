import { Pressable, StyleSheet, Text, View } from 'react-native';
import TodayMedicineItem from './TodayMedicineItem';

export default function TodayMedicineList() {
  return(
    <View style={styles.todayMedicineListContainer}>
      <View style={styles.todayMedicineListHeader}>
        <Text style={styles.todayMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.todayMedicineListHeaderStatus}>0/0 완료</Text>
      </View>
      <View style={styles.todayMedicineList}>
        <TodayMedicineItem title="123" timeOfDay='아침' time='00:00'/>
        <TodayMedicineItem title="234" timeOfDay='점심' time='12:00'/>
        <TodayMedicineItem title="345" timeOfDay='저녁' time='24:00'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayMedicineListContainer: {
    justifyContent: 'space-between',
    gap: 10,
    width: '95%',

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