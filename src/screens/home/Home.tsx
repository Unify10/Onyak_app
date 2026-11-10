import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, ScrollView } from 'react-native';
import MedicinePhoto from '../../components/Home/MedicinePhoto/MedicinePhoto';
import MedicineList from '../../components/Home/TodayMedicineList/TodayMedicineList';
import ActiveMedicineList from '../../components/Home/ActiveMedicineList/ActiveMedicineList';
import HomeFamilyAccountList from '../../components/Home/HomeFamilyAccount/HomeFamilyAccountList';
import PageTitle from '../../components/Home/PageTitle/PageTitle';

export default function Home() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <ScrollView
      style={styles.homeContainer}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      overScrollMode="never"
    >
      <PageTitle />
      <MedicinePhoto/>
      <MedicineList/>
      <ActiveMedicineList/>
      <HomeFamilyAccountList/>
    </ScrollView>
  );
}

const baseStyles = StyleSheet.create({
  homeContainer: { flex: 1, width: '100%' },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 40,
    gap: 20,
  },
});
