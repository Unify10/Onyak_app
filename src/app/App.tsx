import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* TODO: 화면 이동 방식이 정해지면 회원가입 이동을 여기서 연결 */}
      <LoginScreen
        onPressSignup={() => Alert.alert('회원가입', '아직 연결되지 않았어요.')}
      />
    </SafeAreaProvider>
  );
}