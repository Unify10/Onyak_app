import { lazy, Suspense } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import ServerFamilyProfile from '../../components/Family/ServerFamilyProfile';
import RoundBackButton from '../../components/Navigation/RoundBackButton';
import DetailSkeleton from '../../components/Skeleton/DetailSkeleton';

const FamilyMedicationDetail = lazy(() => import('../../screens/Family/FamilyMedicationDetail'));

export default function FamilyMedicationRoute() {
  const { dependentId, isAuthenticated } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  if (dependentId) return <Redirect href="/dependent" />;
  if (!isAuthenticated) return <Redirect href="/login" />;
  if (id && /^\d+$/.test(id)) return <ServerFamilyProfile key={id} id={id} />;
  return (
    <Suspense fallback={(
      <DetailSkeleton
        kind="family"
        label="가족 복용 현황 불러오는 중"
        header={<RoundBackButton accessibilityLabel="가족 목록으로 돌아가기" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')} />}
      />
    )}>
      <FamilyMedicationDetail />
    </Suspense>
  );
}
