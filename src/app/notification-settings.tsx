import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import NotificationSettingsScreen from '../screens/Notifications/NotificationSettingsScreen';

export default function NotificationSettingsRoute() {
  const { isAuthenticated, dependentId } = useAuth();
  if (!isAuthenticated) return <Redirect href={dependentId ? '/dependent/my-info' : '/login'} />;
  return <NotificationSettingsScreen />;
}
