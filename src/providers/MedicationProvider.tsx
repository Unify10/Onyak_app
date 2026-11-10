import { createContext, useContext, useState, type ReactNode } from 'react';

type MedicationContextValue = {
  medicineIds: string[];
  toggleMedicine: (id: string) => void;
};
const MedicationContext = createContext<MedicationContextValue | null>(null);

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medicineIds, setMedicineIds] = useState<string[]>(['1', '2', '3']);
  function toggleMedicine(id: string) {
    setMedicineIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }
  return <MedicationContext.Provider value={{ medicineIds, toggleMedicine }}>{children}</MedicationContext.Provider>;
}

export function useMedications() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error('복용 목록 제공자가 필요합니다.');
  return value;
}
