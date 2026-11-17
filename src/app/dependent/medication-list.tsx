import { useDependentProfile } from '../../hooks/useDependentProfile';
import MedicationList from '../../screens/MedicationList/MedicationList';

export default function DependentMedicationListRoute() {
  const profile = useDependentProfile();
  return profile ? <MedicationList dependent dependentProfile={profile} /> : null;
}
