import { Pressable, StyleSheet, Text, View } from 'react-native';
import MedicinePhotoIcon from '../../../../assets/medicine-photo.svg';

export default function MedicinePhoto() {
  return (
    <Pressable style={styles.medicinePhotoButton}>
      <View>
        <Text style={styles.title}>약 성분 촬영/검색</Text>
        <Text style={styles.info}>AI가 즉시 안정성을 확인해요</Text>
      </View>
      <View>
        <MedicinePhotoIcon/>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  medicinePhotoButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // alignSelf: 'stretch',
    backgroundColor: '#000000',
    borderRadius: 15,
    width: '95%',
    padding: 20,
  },

  title : {
    color: '#ffffff',
    fontSize: 20,
  },

  info : {
    fontSize: 16,
    color: "#D1D5DB",
  },
  

});