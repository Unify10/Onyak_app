import CreateFamily from '../../components/Family/CreateFamily/CreateFamily';
import { StyleSheet, View } from 'react-native';


export default function Family() {
  return (
    <View style={styles.container}>
      <CreateFamily/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});