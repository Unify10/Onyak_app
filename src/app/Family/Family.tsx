import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { StyleSheet, View } from 'react-native';
import FamilyList from '../../components/Family/CreateFamily/FamilyList/FamilyList';


export default function Family() {
  return (
    <View style={styles.container}>
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