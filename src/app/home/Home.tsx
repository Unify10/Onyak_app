import { StyleSheet, View, ScrollView } from 'react-native';
import MedicinePhoto from '../../components/Home/MedicinePhoto/MedicinePhoto';
import MedicineList from '../../components/Home/TodayMedicineList/TodayMedicineList';
import ActiveMedicineList from '../../components/Home/ActiveMedicineList/ActiveMedicineList';
import HomeFamilyAccountItem from '../../components/Home/HomeFamilyAccount/HomeFamilyAccountItem';
import HomeFamilyAccountList from '../../components/Home/HomeFamilyAccount/HomeFamilyAccountList';

export default function Home() {
  return (
    <ScrollView 
      style={styles.homeContainer}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      overScrollMode="never"
    >
      <MedicinePhoto/>
      <MedicineList/>
      <ActiveMedicineList/>
      <HomeFamilyAccountList/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    // paddingHorizontal: 20,
    // paddingTop: 24,
    // gap: 20,
    width: '100%',

  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // 원래 24
    paddingBottom: 40,        
    gap: 20,                    
  },
});