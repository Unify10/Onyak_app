import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { emptyPersonalInfo, type PersonalInfo } from '../utils/personalInfo';

type ProfileContextValue = { profile: PersonalInfo; saveProfile: (profile: PersonalInfo) => void; resetProfile: () => void };
const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { accountId } = useAuth();
  const [stored, setStored] = useState({ accountId, profile: emptyPersonalInfo });
  if (stored.accountId !== accountId) setStored({ accountId, profile: emptyPersonalInfo });

  const saveProfile = useCallback((profile: PersonalInfo) => {
    setStored(current => current.accountId === accountId ? { accountId, profile } : current);
  }, [accountId]);
  const profile = stored.accountId === accountId ? stored.profile : emptyPersonalInfo;

  return <ProfileContext.Provider value={{ profile, saveProfile, resetProfile: () => saveProfile(emptyPersonalInfo) }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('프로필 제공자가 필요합니다.');
  return value;
}
