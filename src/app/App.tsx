import { useState } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LinkedCodeLoginScreen from './screens/LinkedCodeLoginScreen';
import QRLoginScreen from './screens/QRLoginScreen';
import FindAccountScreen from './screens/FindAccountScreen';

type Screen = 'login' | 'signup' | 'linkedCode' | 'qr' | 'findAccount';
type FindMode = 'id' | 'password';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [findMode, setFindMode] = useState<FindMode>('id');

  const [fontsLoaded] = useFonts({
  Pretendard: require(
    '../../assets/fonts/Pretendard-Regular.otf/public/static/Pretendard-Regular.otf'
  ),
});

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      {currentScreen === 'login' && (
        <LoginScreen
          onPressSignup={() => setCurrentScreen('signup')}
          onPressLinkedCode={() => setCurrentScreen('linkedCode')}
          onPressQRLogin={() => setCurrentScreen('qr')}
          onPressFindPassword={() => {
            setCurrentScreen('findAccount');
          }}
        />
      )}

      {currentScreen === 'signup' && (
        <SignupScreen
          onPressBack={() => setCurrentScreen('login')}
          onComplete={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'linkedCode' && (
        <LinkedCodeLoginScreen
          onPressBack={() => setCurrentScreen('login')}
          onComplete={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'qr' && (
        <QRLoginScreen
          onPressBack={() => setCurrentScreen('login')}
          onComplete={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'findAccount' && (
        <FindAccountScreen
          onPressBack={() => setCurrentScreen('login')}
        />
      )}
    </SafeAreaProvider>
  );
}