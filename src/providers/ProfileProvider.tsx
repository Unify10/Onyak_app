import { createContext, useContext, useState, type ReactNode } from 'react';
import { emptyPersonalInfo, type PersonalInfo } from '../utils/personalInfo';

type ProfileContextValue = { profile: PersonalInfo; saveProfile: (profile: PersonalInfo) => void; resetProfile: () => void };
const ProfileContext = createContext<ProfileContextValue | null>(null);
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PersonalInfo>({ ...emptyPersonalInfo, name: '김민지' });
  return <ProfileContext.Provider value={{ profile, saveProfile: setProfile, resetProfile: () => setProfile({ ...emptyPersonalInfo }) }}>{children}</ProfileContext.Provider>;
}
export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('프로필 제공자가 필요합니다.');
  return value;
}
