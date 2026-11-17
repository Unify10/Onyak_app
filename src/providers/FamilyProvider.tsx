import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FamilyInvitation } from '../utils/familyInvitation';
import type { PersonalInfo } from '../utils/personalInfo';

export type FamilyDraft = { id: string; details: PersonalInfo; code: string; expiresAt: number };
type FamilyContextValue = {
  families: FamilyDraft[];
  addFamily: (details: PersonalInfo, invitation: FamilyInvitation) => void;
  updateFamilyInvitation: (id: string, invitation: FamilyInvitation) => void;
  updateFamily: (id: string, details: PersonalInfo) => void;
  removeFamily: (id: string) => void;
  clearFamilies: () => void;
};
const FamilyContext = createContext<FamilyContextValue | null>(null);
export function FamilyProvider({ children }: { children: ReactNode }) {
  const [families, setFamilies] = useState<FamilyDraft[]>([]);
  function addFamily(details: PersonalInfo, invitation: FamilyInvitation) { setFamilies(current => [...current, { id: `${Date.now()}-${current.length}`, details: { ...details, name: details.name.trim() }, ...invitation }]); }
  function updateFamilyInvitation(id: string, invitation: FamilyInvitation) {
    setFamilies(current => current.map(family => family.id === id ? { ...family, ...invitation } : family));
  }
  function updateFamily(id: string, details: PersonalInfo) { setFamilies(current => current.map(family => family.id === id ? { ...family, details: { ...details, name: details.name.trim() } } : family)); }
  function removeFamily(id: string) { setFamilies(current => current.filter(family => family.id !== id)); }
  return <FamilyContext.Provider value={{ families, addFamily, updateFamilyInvitation, updateFamily, removeFamily, clearFamilies: () => setFamilies([]) }}>{children}</FamilyContext.Provider>;
}
export function useFamilies() { const value = useContext(FamilyContext); if (!value) throw new Error('가족 정보 제공자가 필요합니다.'); return value; }
