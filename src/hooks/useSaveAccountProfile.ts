import { patchAccountProfile, type AccountChanges } from '../api/profile';
import { useAuth } from '../providers/AuthProvider';
import { useAccountMutation } from './useAccountMutation';

export function useSaveAccountProfile() {
  const { accountId, clearLocalSession } = useAuth();
  const { run, ...status } = useAccountMutation('개인정보를 저장하지 못했어요.');

  async function saveAccount(changes: AccountChanges) {
    if (accountId === null) return false;
    const result = await run(async (token, signal) => {
      const profile = await patchAccountProfile(changes, token, signal);
      if (profile?.user_id !== accountId) throw new Error('저장된 개인정보를 확인하지 못했어요.');
      return profile;
    });
    if (!result.ok) return false;
    if (changes.password) clearLocalSession();
    return true;
  }

  return { ...status, saveAccount };
}
