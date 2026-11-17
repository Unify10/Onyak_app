import { MedicationProvider } from '../providers/MedicationProvider';
import { ProfileProvider } from '../providers/ProfileProvider';
import { FamilyProvider } from '../providers/FamilyProvider';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../providers/AuthProvider';
import { SearchHistoryProvider } from '../providers/SearchHistoryProvider';
import { NotificationProvider } from '../providers/NotificationProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: require('../../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard-ExtraBold.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
        <SearchHistoryProvider>
          <MedicationProvider>
          <ProfileProvider>
          <FamilyProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="linked-code-login" />
            <Stack.Screen name="qr-login" />
            <Stack.Screen name="find-account" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </FamilyProvider>
          </ProfileProvider>
          </MedicationProvider>
        </SearchHistoryProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
