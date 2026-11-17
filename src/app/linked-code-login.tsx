import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import LinkedCodeLoginScreen from '../screens/Auth/LinkedCodeLoginScreen';
import { useAuth } from '../providers/AuthProvider';
import { useFamilies } from '../providers/FamilyProvider';
import { findInvitedFamily, getTestDependent } from '../utils/familyInvitation';

export default function LinkedCodeLoginRoute() {
  const { dependentId, signInDependent } = useAuth();
  const { families } = useFamilies();
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const testDependent = getTestDependent();
  if (dependentId) return <Redirect href="/dependent" />;

  return (
    <LinkedCodeLoginScreen
      onPressBack={() => router.canGoBack() ? router.back() : router.replace('/login')}
      onSubmitCode={async input => {
        const family = findInvitedFamily(families, input);
        const testAccount = testDependent && input === testDependent.code && !families.some(item => item.code === input)
          ? testDependent
          : undefined;
        const id = family?.id ?? testAccount?.id;
        setVerifiedId(id ?? null);
        return { success: !!id, userName: family?.details.name ?? testAccount?.name };
      }}
      onComplete={() => {
        if (testDependent && verifiedId === testDependent.id) {
          signInDependent(testDependent.id);
          return;
        }
        if (!families.some(family => family.id === verifiedId && family.expiresAt > Date.now())) {
          router.replace('/login');
          return;
        }
        if (verifiedId) signInDependent(verifiedId);
      }}
    />
  );
}
