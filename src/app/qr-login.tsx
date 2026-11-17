import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import QRLoginScreen from '../screens/Auth/QRLoginScreen';
import { useAuth } from '../providers/AuthProvider';
import { useFamilies } from '../providers/FamilyProvider';
import { findInvitedFamily, readFamilyQr } from '../utils/familyInvitation';

export default function QRLoginRoute() {
  const { dependentId, signInDependent } = useAuth();
  const { families } = useFamilies();
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  if (dependentId) return <Redirect href="/dependent" />;

  return (
    <QRLoginScreen
      onPressBack={() => router.canGoBack() ? router.back() : router.replace('/login')}
      onSubmitQr={async input => {
        const invitation = readFamilyQr(input);
        const family = invitation && findInvitedFamily(families, invitation.code, invitation.expiresAt);
        setVerifiedId(family?.id ?? null);
        return { success: !!family, userName: family?.details.name };
      }}
      onComplete={() => {
        if (!families.some(family => family.id === verifiedId && family.expiresAt > Date.now())) {
          router.replace('/login');
          return;
        }
        if (verifiedId) signInDependent(verifiedId);
      }}
    />
  );
}
