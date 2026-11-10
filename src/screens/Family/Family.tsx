import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { ScrollView, StyleSheet } from 'react-native';
import FamilyList from '../../components/Family/FamilyList/FamilyList';
import PageTitle from '../../components/Family/PageTitle/PageTitle';


export default function Family() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <PageTitle />
      <CreateFamily />
      <FamilyList />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
