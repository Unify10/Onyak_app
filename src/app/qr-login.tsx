import { Redirect, router } from 'expo-router';
import { useWardLogin } from '../hooks/useWardLogin';
import { useAuth } from '../providers/AuthProvider';
import QRLoginScreen from '../screens/Auth/QRLoginScreen';

export default function QRLoginRoute() {
  const { dependentId, isAuthenticated } = useAuth();
  const { submit, verified } = useWardLogin();
  if (dependentId && !verified) return <Redirect href="/dependent" />;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <QRLoginScreen
      onPressBack={() => {
        if (verified) router.replace('/dependent');
        else if (router.canGoBack()) router.back();
        else router.replace('/login');
      }}
      onSubmitQr={input => {
        const token = input.trim();
        if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(token)) {
          return Promise.resolve({ success: false, message: '온약 가족 연동 QR 코드를 스캔해주세요.' });
        }
        return submit({ qr_token: token });
      }}
      onComplete={() => router.replace('/dependent')}
    />
  );
}
