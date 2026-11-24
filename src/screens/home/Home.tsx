import { lazy, Suspense } from 'react';
import SosSlider from '../../components/Home/SosSlider';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, ScrollView } from 'react-native';
import MedicinePhoto from '../../components/Home/MedicinePhoto/MedicinePhoto';
import TodayMedicineListSkeleton from '../../components/Home/TodayMedicineList/TodayMedicineListSkeleton';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import PageTitle from '../../components/Home/PageTitle/PageTitle';
import Text from '../../components/Typography/Text';

const TodayMedicineList = lazy(() => import('../../components/Home/TodayMedicineList/TodayMedicineList'));

const ActiveMedicineList = lazy(() => import('../../components/Home/ActiveMedicineList/ActiveMedicineList'));
const HomeFamilyAccountList = lazy(() => import('../../components/Home/HomeFamilyAccount/HomeFamilyAccountList'));

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
      <Suspense fallback={<TodayMedicineListSkeleton />}>
        <TodayMedicineList />
      </Suspense>
      <Suspense fallback={<ListSkeleton title="복용 중인 약·영양제" label="복용 중인 약과 영양제 불러오는 중" layout="cards" />}>
        <ActiveMedicineList readOnly={!!dependentName} />
      </Suspense>
      {dependentName && <SosSlider name={dependentName} />}
      {!dependentName && (
        <Suspense fallback={<ListSkeleton title="가족 계정" label="가족 계정 불러오는 중" layout="avatars" />}>
          <HomeFamilyAccountList />
        </Suspense>
      )}
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
