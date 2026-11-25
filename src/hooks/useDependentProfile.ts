import { useAuth } from '../providers/AuthProvider';
import { emptyPersonalInfo } from '../utils/personalInfo';

export function useDependentProfile() {
  const { dependentId, displayName } = useAuth();
  return dependentId ? { ...emptyPersonalInfo, name: displayName } : undefined;
}
