import { StyleSheet, View } from 'react-native';
import MedicinePhoto from '../../components/Home/MedicinePhoto/MedicinePhoto';
import MedicineList from '../../components/Home/TodayMedicineList/TodayMedicineList';

export default function Home() {
  return (
    <View style={styles.container}>
      <MedicinePhoto/>
      <MedicineList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
});