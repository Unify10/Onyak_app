import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { useProfile } from '../providers/ProfileProvider';
import { calculateAge, emptyPersonalInfo, type PersonalInfo } from '../utils/personalInfo';

type ProfileState =
  | { status: 'loading' }
  | { status: 'ready'; attempt: number }
  | { status: 'error'; attempt: number; message: string };

export function useAccountProfile(enabled: boolean) {
  const { loadProfile } = useAuth();
  const { profile, saveProfile } = useProfile();
  const [state, setState] = useState<ProfileState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(useCallback(() => {
    if (!enabled) return;
    const controller = new AbortController();

    void loadProfile(controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const profile: PersonalInfo = {
        ...emptyPersonalInfo,
        name: data.name,
        birthDate: data.birth_date ?? '',
        age: data.age == null ? calculateAge(data.birth_date ?? '') : String(data.age),
        gender: data.gender === 'M' ? '남성' : data.gender === 'F' ? '여성' : '선택 안함',
        height: data.height == null ? '' : String(data.height),
        weight: data.weight == null ? '' : String(data.weight),
        pregnant: data.is_pregnant === true,
        pregnancyStatusProvided: typeof data.is_pregnant === 'boolean',
      };
      saveProfile(profile);
      setState({ status: 'ready', attempt });
    }).catch(error => {
      if (!controller.signal.aborted) {
        setState({ status: 'error', attempt, message: error instanceof Error ? error.message : '내 정보를 불러오지 못했어요.' });
      }
    });

    return () => controller.abort();
  }, [attempt, enabled, loadProfile, saveProfile]));

  function retry() {
    setAttempt(current => current + 1);
  }

  if (state.status === 'loading' || state.attempt !== attempt) {
    return { state: { status: 'loading' } as const, retry };
  }
  return { state: state.status === 'ready' ? { ...state, profile } : state, retry };
}
