import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useProfile } from '../providers/ProfileProvider';
import { emptyPersonalInfo, type PersonalInfo } from '../utils/personalInfo';

type ProfileState =
  | { status: 'loading' }
  | { status: 'ready'; profile: PersonalInfo }
  | { status: 'error'; message: string };

export function useAccountProfile(enabled: boolean) {
  const { loadProfile } = useAuth();
  const { saveProfile } = useProfile();
  const [state, setState] = useState<ProfileState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    void loadProfile(controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const profile: PersonalInfo = {
        ...emptyPersonalInfo,
        name: data.name,
        age: data.age == null ? '' : String(data.age),
        gender: data.gender === 'M' ? '남성' : data.gender === 'F' ? '여성' : '선택 안함',
        height: data.height == null ? '' : String(data.height),
        weight: data.weight == null ? '' : String(data.weight),
        pregnant: data.is_pregnant === true,
        pregnancyStatusProvided: typeof data.is_pregnant === 'boolean',
      };
      saveProfile(profile);
      setState({ status: 'ready', profile });
    }).catch(error => {
      if (!controller.signal.aborted) {
        setState({ status: 'error', message: error instanceof Error ? error.message : '내 정보를 불러오지 못했어요.' });
      }
    });

    return () => controller.abort();
  }, [attempt, enabled, loadProfile, saveProfile]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt(current => current + 1);
  }

  return { state, retry };
}
