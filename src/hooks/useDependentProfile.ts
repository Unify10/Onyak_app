import { useAuth } from '../providers/AuthProvider';
import { useFamilies } from '../providers/FamilyProvider';
import { getTestDependent } from '../utils/familyInvitation';
import { emptyPersonalInfo } from '../utils/personalInfo';

export function useDependentProfile() {
  const { dependentId } = useAuth();
  const { families } = useFamilies();
  const testDependent = getTestDependent();
  if (testDependent && testDependent.id === dependentId) {
    return { ...emptyPersonalInfo, name: testDependent.name };
  }
  return families.find(family => family.id === dependentId)?.details;
}
