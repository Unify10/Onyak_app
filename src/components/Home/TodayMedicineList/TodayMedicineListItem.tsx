import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MedicineData {
  title : string;
  timeOfDay : '아침' | '점심' | '저녁' | '취침 전' | '공복' | '식사와 관계 없이';
  time : string;
}

export default function TodayMedicineListItem({ title, timeOfDay, time}: MedicineData) {
  return (
    <View style={styles.cardContainer}>
      <View><Text>체크박스</Text></View>
      <View>
        <Text style={styles.todayMedicineListItemTitle}>{title}</Text>
        <Text style={styles.todayMedicineListItemInfo}>{timeOfDay} · {time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  todayMedicineListItemTitle: {
    fontSize: 20,
  },
  todayMedicineListItemInfo: {
    fontSize: 16,
  }
}); 