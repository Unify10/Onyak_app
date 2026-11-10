import MyInfo from '../../screens/MyInfo/MyInfo';
import { useAuth } from '../../providers/AuthProvider';

export default function MyInfoRoute() {
  const { displayName, email, signOut } = useAuth();
  return <MyInfo displayName={displayName} email={email} onSignOut={signOut} />;
}
