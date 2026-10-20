import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar/BottomTabBar';
import MedicinePhoto from '../components/Home/MedicinePhoto/MedicinePhoto';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.content}>
          <MedicinePhoto/>
        </View>
        <StatusBar style="auto" />
        <BottomTabBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
