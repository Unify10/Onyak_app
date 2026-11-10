import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { ScrollView, StyleSheet } from 'react-native';
import FamilyList from '../../components/Family/FamilyList/FamilyList';
import PageTitle from '../../components/Family/PageTitle/PageTitle';


export default function Family() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <PageTitle />
      <CreateFamily />
      <FamilyList />
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
