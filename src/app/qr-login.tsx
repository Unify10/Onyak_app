import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import QRLoginScreen from '../screens/Auth/QRLoginScreen';
import { useAuth } from '../providers/AuthProvider';
import { useFamilies } from '../providers/FamilyProvider';
import { findInvitedFamily, readFamilyQr } from '../utils/familyInvitation';

export default function QRLoginRoute() {
  const { dependentId, signInDependent } = useAuth();
  const { families } = useFamilies();
  const [verified, setVerified] = useState<{ id: string; code: string; expiresAt?: number } | null>(null);
  if (dependentId) return <Redirect href="/dependent" />;

  return (
    <QRLoginScreen
      onPressBack={() => router.canGoBack() ? router.back() : router.replace('/login')}
      onSubmitQr={async input => {
        const invitation = readFamilyQr(input);
        const family = invitation && findInvitedFamily(families, invitation.code, invitation.expiresAt);
        setVerified(family ? { id: family.id, code: family.code, expiresAt: family.expiresAt } : null);
        return { success: !!family, userName: family?.details.name };
      }}
      onComplete={() => {
        if (!verified || findInvitedFamily(families, verified.code, verified.expiresAt)?.id !== verified.id) {
          router.replace('/login');
          return;
        }
        signInDependent(verified.id);
      }}
    />
  );
}
