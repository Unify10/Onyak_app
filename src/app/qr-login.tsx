import { router } from 'expo-router';
import QRLoginScreen from '../screens/Auth/QRLoginScreen';
import { useAuth } from '../providers/AuthProvider';

export default function QRLoginRoute() {
  const { signIn } = useAuth();
  return <QRLoginScreen onPressBack={() => router.back()} onComplete={() => { signIn(); router.replace('/(tabs)'); }} />;
}
