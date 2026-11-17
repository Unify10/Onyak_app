import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

export default function IndexRoute() {
  const { dependentId, isAuthenticated } = useAuth();
  if (dependentId) return <Redirect href="/dependent" />;
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
