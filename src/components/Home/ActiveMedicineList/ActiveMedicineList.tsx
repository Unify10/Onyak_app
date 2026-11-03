import { Pressable, StyleSheet, Text, View } from 'react-native';
import ActiveMedicineItem from './ActiveMedicineItem';


export default function ActiveMedicineList() {
  return(
    <View style={styles.activeMedicineListContainer}>
      <View style={styles.activeMedicineListHeader}>
        <Text style={styles.activeMedicineListHeaderTitle}>오늘의 복용</Text>
        <Text style={styles.activeMedicineListHeaderStatus}>0/0 완료</Text>
      </View>
      <View style={styles.activeMedicineList}>
        <ActiveMedicineItem activeMedicineTitle='1' activeMedicineInfo='1'/>
        <ActiveMedicineItem activeMedicineTitle='1' activeMedicineInfo='1'/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeMedicineListContainer: {
    justifyContent: 'space-between',
    gap: 10,
    width: '95%',

  },
  activeMedicineListHeader:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
  },
  activeMedicineListHeaderTitle: {
    fontSize: 20,

  },
  activeMedicineListHeaderStatus: {
    fontSize: 16,
    color: '#6B7280',
  },

  activeMedicineList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: '5%',
    width: '100%',

  },
});