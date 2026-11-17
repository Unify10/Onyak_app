import { useDependentProfile } from '../../hooks/useDependentProfile';
import { useAuth } from '../../providers/AuthProvider';
import MyInfo from '../../screens/MyInfo/MyInfo';

export default function DependentMyInfoRoute() {
  const profile = useDependentProfile();
  const { signOut } = useAuth();
  if (!profile) return null;
  return <MyInfo displayName={profile.name} email="" dependentProfile={profile} onSignOut={signOut} />;
}
