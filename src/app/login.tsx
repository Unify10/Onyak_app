import { router, Redirect } from 'expo-router';
import LoginScreen from '../screens/Auth/LoginScreen';
import { useAuth } from '../providers/AuthProvider';

export default function LoginRoute() {
  const { dependentId, isAuthenticated, signIn } = useAuth();
  if (dependentId) return <Redirect href="/dependent" />;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <LoginScreen
      onPressSignup={() => router.push('/signup')}
      onPressLinkedCode={() => router.push('/linked-code-login')}
      onPressQRLogin={() => router.push('/qr-login')}
      onPressFindPassword={() => router.push('/find-account')}
      onLoginSuccess={(email) => {
        signIn(undefined, email);
        router.replace('/(tabs)');
      }}
    />
  );
}
