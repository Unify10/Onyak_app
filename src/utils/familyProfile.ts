import type { FamilyProfile } from '../api/family';
import { calculateAge, emptyPersonalInfo, type PersonalInfo } from './personalInfo';

export function toFamilyPersonalInfo(data: FamilyProfile): PersonalInfo {
  const birthDate = data.birth_date ?? '';
  return {
    ...emptyPersonalInfo,
    name: data.name,
    birthDate,
    age: calculateAge(birthDate),
    height: data.height == null ? '' : String(data.height),
    weight: data.weight == null ? '' : String(data.weight),
    gender: data.gender === 'F' ? '여성' : data.gender === 'M' ? '남성' : '선택 안함',
    pregnant: data.is_pregnant === true,
    pregnancyStatusProvided: typeof data.is_pregnant === 'boolean',
  };
}
