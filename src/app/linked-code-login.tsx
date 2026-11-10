import { router } from 'expo-router';
import LinkedCodeLoginScreen from '../screens/Auth/LinkedCodeLoginScreen';
import { useAuth } from '../providers/AuthProvider';

export default function LinkedCodeLoginRoute() {
  const { signIn } = useAuth();
  return <LinkedCodeLoginScreen onPressBack={() => router.back()} onComplete={() => { signIn(); router.replace('/(tabs)'); }} />;
}
