import { lazy, Suspense } from 'react';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { ScrollView, StyleSheet } from 'react-native';
import FamilyListLayout from '../../components/Family/FamilyList/FamilyListLayout';
import PageTitle from '../../components/Family/PageTitle/PageTitle';

const FamilyList = lazy(() => import('../../components/Family/FamilyList/FamilyList'));

export default function Family() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <PageTitle />
      <CreateFamily />
      <Suspense fallback={<FamilyListLayout loading />}>
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
