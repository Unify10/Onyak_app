import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { StyleSheet, View } from 'react-native';
import FamilyList from '../../components/Family/FamilyList/FamilyList';
import PageTitle from '../../components/Family/PageTitle/PageTitle';


export default function Family() {
  return (
    <View style={styles.container}>
      <PageTitle />
      <CreateFamily/>
      <FamilyList/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20
    
  },
});
