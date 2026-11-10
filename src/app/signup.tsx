import { router } from 'expo-router';
import SignupScreen from '../screens/Auth/SignupScreen';

export default function SignupRoute() {
  return <SignupScreen onPressBack={() => router.back()} onComplete={() => router.replace('/login')} />;
}
