import { StatusBar } from 'expo-status-bar';
<<<<<<< Updated upstream
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
=======
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LinkedCodeLoginScreen from './screens/LinkedCodeLoginScreen';
import QRLoginScreen from './screens/QRLoginScreen';
import FindAccountScreen from './screens/FindAccountScreen';
import MainScreens from './MainScreens';

type Screen =
  | 'login'
  | 'signup'
  | 'linkedCode'
  | 'qr'
  | 'findAccount'
  | 'main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const [fontsLoaded] = useFonts({
    Pretendard: require(
      '../../assets/fonts/Pretendard-Regular.otf/public/static/Pretendard-Regular.otf',
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
          onLoginSuccess={() => setCurrentScreen('main')}
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
          onComplete={() => setCurrentScreen('main')}
        />
      )}

      {currentScreen === 'qr' && (
        <QRLoginScreen
          onPressBack={() => setCurrentScreen('login')}
          onComplete={() => setCurrentScreen('main')}
        />
      )}

      {currentScreen === 'findAccount' && (
        <FindAccountScreen
          onPressBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'main' && <MainScreens />}
    </SafeAreaProvider>
  );
}
>>>>>>> Stashed changes
