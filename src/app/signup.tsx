import { router } from 'expo-router';
import SignupScreen from '../screens/Auth/SignupScreen';

export default function SignupRoute() {
  return (
    <SignupScreen
      onPressBack={() => router.canGoBack() ? router.back() : router.replace('/login')}
      onComplete={() => router.replace('/login')}
    />
  );
}
