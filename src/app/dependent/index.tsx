import { useDependentProfile } from '../../hooks/useDependentProfile';
import Home from '../../screens/home/Home';

export default function DependentHomeRoute() {
  const profile = useDependentProfile();
  return profile ? <Home dependentName={profile.name} /> : null;
}
