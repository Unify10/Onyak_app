import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar/BottomTabBar';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
      <StatusBar style="auto" />
      <BottomTabBar />
    </View>
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
