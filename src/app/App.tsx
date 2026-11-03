import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../components/BottomTabBar/BottomTabBar';
import Family from './Family/Family';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.content}>
          <Family />
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
