import SosSlider from '../../components/Home/SosSlider';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, ScrollView } from 'react-native';
import MedicinePhoto from '../../components/Home/MedicinePhoto/MedicinePhoto';
import MedicineList from '../../components/Home/TodayMedicineList/TodayMedicineList';
import ActiveMedicineList from '../../components/Home/ActiveMedicineList/ActiveMedicineList';
import HomeFamilyAccountList from '../../components/Home/HomeFamilyAccount/HomeFamilyAccountList';
import PageTitle from '../../components/Home/PageTitle/PageTitle';
import Text from '../../components/Typography/Text';

export default function Home({ dependentName }: { dependentName?: string }) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <ScrollView
      style={styles.homeContainer}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      overScrollMode="never"
    >
      <PageTitle dependentName={dependentName} />
      {!dependentName && <MedicinePhoto />}
      <MedicineList/>
      <ActiveMedicineList readOnly={!!dependentName} />
      {dependentName && <SosSlider name={dependentName} />}
      {!dependentName && <HomeFamilyAccountList />}
      <Text style={styles.footer}>좋은 하루 보내세요</Text>
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
  footer: { alignSelf: 'flex-end', color: '#7B8494', fontSize: 14, marginTop: 4 },
});
