import { Redirect } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import FamilyMedicationDetail from '../../screens/Family/FamilyMedicationDetail';

export default function FamilyMedicationRoute() {
  const { dependentId, isAuthenticated } = useAuth();
  if (dependentId) return <Redirect href="/dependent" />;
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <FamilyMedicationDetail />;
}
