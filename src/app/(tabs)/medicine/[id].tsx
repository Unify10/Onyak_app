import { lazy, Suspense } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { medicines } from '../../../components/Search/medicineData';
import RoundBackButton from '../../../components/Navigation/RoundBackButton';
import DetailSkeleton from '../../../components/Skeleton/DetailSkeleton';

const MedicineDetailScreen = lazy(() => import('../../../screens/MedicineDetail/MedicineDetailScreen'));

export default function MedicineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicine = medicines.find(item => item.id === id);
  if (!medicine) return <Redirect href="/search" />;
  return (
    <Suspense fallback={(
      <DetailSkeleton
        kind="medicine"
        label="약 상세 정보 불러오는 중"
        header={<RoundBackButton accessibilityLabel="이전 화면으로 돌아가기" onPress={() => router.canGoBack() ? router.back() : router.replace('/search')} />}
      />
    )}>
      <MedicineDetailScreen key={medicine.id} medicine={medicine} />
    </Suspense>
  );
}
