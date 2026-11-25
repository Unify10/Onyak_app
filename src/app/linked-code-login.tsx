import { Redirect, router } from 'expo-router';
import { useWardLogin } from '../hooks/useWardLogin';
import { useAuth } from '../providers/AuthProvider';
import LinkedCodeLoginScreen from '../screens/Auth/LinkedCodeLoginScreen';

export default function LinkedCodeLoginRoute() {
  const { dependentId, isAuthenticated } = useAuth();
  const { submit, verified } = useWardLogin();
  if (dependentId && !verified) return <Redirect href="/dependent" />;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <LinkedCodeLoginScreen
      onPressBack={() => {
        if (verified) router.replace('/dependent');
        else if (router.canGoBack()) router.back();
        else router.replace('/login');
      }}
      onSubmitCode={code => submit({ code })}
      onComplete={() => router.replace('/dependent')}
    />
  );
}
