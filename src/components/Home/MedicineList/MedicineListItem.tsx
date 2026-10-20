import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MedicineData {
  title : string;
  timeOfDay : '아침' | '점심' | '저녁' | '취침 전' | '공복' | '식사와 관계 없이';
  time : string;
}

export default function MedicineListItem({ title, timeOfDay, time}: MedicineData) {
  return (
    <View style={styles.cardContainer}>
      <View>
        <View></View> // 체크박스 자리
        <View>
          <Text>{title}</Text>
          <Text>{timeOfDay} · {time}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,

  },
}); 