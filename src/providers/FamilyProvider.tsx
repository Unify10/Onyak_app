import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PersonalInfo } from '../utils/personalInfo';

type FamilyDraft = { id: string; details: PersonalInfo; expiresAt: number };
type FamilyContextValue = { families: FamilyDraft[]; addFamily: (details: PersonalInfo, expiresAt: number) => void; clearFamilies: () => void };
const FamilyContext = createContext<FamilyContextValue | null>(null);
export function FamilyProvider({ children }: { children: ReactNode }) {
  const [families, setFamilies] = useState<FamilyDraft[]>([]);
  function addFamily(details: PersonalInfo, expiresAt: number) { setFamilies(current => [...current, { id: `${Date.now()}-${current.length}`, details: { ...details, name: details.name.trim() }, expiresAt }]); }
  return <FamilyContext.Provider value={{ families, addFamily, clearFamilies: () => setFamilies([]) }}>{children}</FamilyContext.Provider>;
}
export function useFamilies() { const value = useContext(FamilyContext); if (!value) throw new Error('가족 정보 제공자가 필요합니다.'); return value; }
