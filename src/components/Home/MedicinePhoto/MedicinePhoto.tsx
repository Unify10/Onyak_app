import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import MedicinePhotoIcon from '../../../../assets/home/medicine-photo.svg';

export default function MedicinePhoto() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <Pressable style={styles.medicinePhotoButton} accessibilityRole="button" accessibilityLabel="약 성분 라벨 촬영" onPress={() => router.navigate({ pathname: '/search', params: { capture: 'label', requestId: String(Date.now()) } })}>
      <View style={styles.medicinePhotoTextContainer}>
        <Text style={styles.title}>약 성분 촬영/검색</Text>
        <Text style={styles.info}>AI가 즉시 안정성을 확인해요</Text>
      </View>
      <View>
        <MedicinePhotoIcon/>
      </View>
    </Pressable>
  )
}

const baseStyles = StyleSheet.create({
  medicinePhotoButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // alignSelf: 'stretch',
    backgroundColor: '#000000',
    borderRadius: 15,
    width: '100%',
    padding: 20,
  },
  medicinePhotoTextContainer: {
    flex: 1,
    gap: 4,
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