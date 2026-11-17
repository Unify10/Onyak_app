import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../providers/AuthProvider';
import { useFamilies } from '../../../providers/FamilyProvider';
import CreateFamilyScreen from '../../../screens/Family/CreateFamily/CreateFamilyScreen';

export default function FamilyInvitationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dependentId, isAuthenticated } = useAuth();
  const { families, updateFamilyInvitation } = useFamilies();
  const family = families.find(item => item.id === id);

  if (dependentId) return <Redirect href="/dependent" />;
  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!family) return <Redirect href="/family" />;

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/family');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <CreateFamilyScreen
        key={family.id}
        initialInvitation={{ code: family.code, expiresAt: family.expiresAt }}
        existingCodes={families.map(item => item.code)}
        onRenew={invitation => updateFamilyInvitation(family.id, invitation)}
        onBack={close}
        onComplete={close}
      />
    </SafeAreaView>
  );
}
