import { lazy, Suspense } from 'react';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { ScrollView, StyleSheet } from 'react-native';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import PageTitle from '../../components/Family/PageTitle/PageTitle';

const FamilyList = lazy(() => import('../../components/Family/FamilyList/FamilyList'));

export default function Family() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <PageTitle />
      <CreateFamily />
      <Suspense fallback={<ListSkeleton title="가족" label="가족 목록 불러오는 중" />}>
        <FamilyList />
      </Suspense>
    </ScrollView>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
