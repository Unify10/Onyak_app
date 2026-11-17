import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import LinkedCodeLoginScreen from '../screens/Auth/LinkedCodeLoginScreen';
import { useAuth } from '../providers/AuthProvider';
import { useFamilies } from '../providers/FamilyProvider';
import { findInvitedFamily, getTestDependent } from '../utils/familyInvitation';

export default function LinkedCodeLoginRoute() {
  const { dependentId, signInDependent } = useAuth();
  const { families } = useFamilies();
  const [verified, setVerified] = useState<{ id: string; code: string; expiresAt?: number } | null>(null);
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
        setVerified(id ? { id, code: input, expiresAt: family?.expiresAt } : null);
        return { success: !!id, userName: family?.details.name ?? testAccount?.name };
      }}
      onComplete={() => {
        if (testDependent && verified?.id === testDependent.id && verified.code === testDependent.code) {
          signInDependent(testDependent.id);
          return;
        }
        if (!verified || findInvitedFamily(families, verified.code, verified.expiresAt)?.id !== verified.id) {
          router.replace('/login');
          return;
        }
        signInDependent(verified.id);
      }}
    />
  );
}
