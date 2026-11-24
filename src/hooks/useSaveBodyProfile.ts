import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useProfile } from '../providers/ProfileProvider';
import { calculateAge, type PersonalInfo } from '../utils/personalInfo';

export function useSaveBodyProfile() {
  const { updateBody } = useAuth();
  const { saveProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function saveBody(draft: PersonalInfo) {
    if (request.current) return false;
    const controller = new AbortController();
    request.current = controller;
    setSaving(true);
    setSaveError('');
    try {
      const saved = await updateBody({
        birth_date: draft.birthDate || undefined,
        height: draft.height ? Number(draft.height) : undefined,
        weight: draft.weight ? Number(draft.weight) : undefined,
        gender: draft.gender === '남성' ? 'M' : draft.gender === '여성' ? 'F' : undefined,
        is_pregnant: draft.gender === '남성' ? false
          : draft.gender === '여성' && draft.pregnancyStatusProvided ? draft.pregnant : undefined,
      }, controller.signal);
      if (controller.signal.aborted) return false;
      const birthDate = saved.birth_date ?? '';
      saveProfile({
        name: draft.name.trim(),
        birthDate,
        age: calculateAge(birthDate),
        height: saved.height == null ? '' : String(saved.height),
        weight: saved.weight == null ? '' : String(saved.weight),
        gender: saved.gender === 'M' ? '남성' : saved.gender === 'F' ? '여성' : '선택 안함',
        pregnant: saved.is_pregnant === true,
        pregnancyStatusProvided: typeof saved.is_pregnant === 'boolean',
      });
      return true;
    } catch (error) {
      if (!controller.signal.aborted) {
        setSaveError(error instanceof Error ? error.message : '신체정보를 저장하지 못했어요.');
      }
      return false;
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setSaving(false);
    }
  }

  return { saveBody, saving, saveError, clearSaveError: () => setSaveError('') };
}
