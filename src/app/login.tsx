import { router, Redirect } from 'expo-router';
import LoginScreen from '../screens/Auth/LoginScreen';
import { login, loginWithGoogle } from '../api/auth';
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
      onGoogleLogin={async (idToken, keepLogin, signal) => {
        const session = await loginWithGoogle(idToken, signal);
        if (!signal.aborted) signIn(session, keepLogin);
      }}
      onLogin={async (email, password, keepLogin, signal) => {
        const session = await login(email, password, signal);
        if (!signal.aborted) signIn(session, keepLogin);
      }}
    />
  );
}
