import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

export default function IndexRoute() {
  const { isAuthenticated } = useAuth();
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
