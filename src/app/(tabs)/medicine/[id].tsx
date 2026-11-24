import { lazy, Suspense, useCallback } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getDrugDetail } from '../../../api/drugs';
import QueryError from '../../../components/Feedback/QueryError';
import RoundBackButton from '../../../components/Navigation/RoundBackButton';
import { medicines } from '../../../components/Search/medicineData';
import DetailSkeleton from '../../../components/Skeleton/DetailSkeleton';
import { useProtectedQuery } from '../../../hooks/useProtectedQuery';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';

const MedicineDetailScreen = lazy(() => import('../../../screens/MedicineDetail/MedicineDetailScreen'));

function backButton() {
  return (
    <RoundBackButton
      accessibilityLabel="이전 화면으로 돌아가기"
      onPress={() => router.canGoBack() ? router.back() : router.replace('/search')}
    />
  );
}

function MedicineLoading() {
  return <DetailSkeleton kind="medicine" label="약 상세 정보 불러오는 중" header={backButton()} />;
}

function ServerMedicineDetail({ drugId }: { drugId: string }) {
  const styles = useResponsiveStyles(baseStyles);
  const query = useCallback((token: string, signal: AbortSignal) => getDrugDetail(drugId, token, signal), [drugId]);
  const { state, retry } = useProtectedQuery(query);

  if (state.status === 'loading') return <MedicineLoading />;
  if (state.status === 'error') {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>{backButton()}</View>
        <QueryError message={state.message} onRetry={retry} />
      </ScrollView>
    );
  }

  return <MedicineDetailScreen medicine={state.data.medicine} information={state.data.information} />;
}

export default function MedicineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serverId = typeof id === 'string' ? /^drug-(\d{1,20})$/.exec(id)?.[1] : undefined;
  const medicine = medicines.find(item => item.id === id);

  if (serverId) {
    return (
      <Suspense fallback={<MedicineLoading />}>
        <ServerMedicineDetail key={serverId} drugId={serverId} />
      </Suspense>
    );
  }
  if (!medicine) return <Redirect href="/search" />;

  return (
    <Suspense fallback={<MedicineLoading />}>
      <MedicineDetailScreen key={medicine.id} medicine={medicine} />
    </Suspense>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 24 },
  header: { minHeight: 72, justifyContent: 'center' },
});
