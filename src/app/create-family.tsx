import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardSignup } from '../hooks/useWardSignup';
import { useAuth } from '../providers/AuthProvider';
import CreateFamilyScreen from '../screens/Family/CreateFamily/CreateFamilyScreen';
import FamilyDetailsScreen from '../screens/Family/CreateFamily/FamilyDetailsScreen';
import { emptyPersonalInfo } from '../utils/personalInfo';

export default function CreateFamilyRoute() {
  const { isAuthenticated, dependentId } = useAuth();
  const { state, register } = useWardSignup();
  const [details, setDetails] = useState(emptyPersonalInfo);
  if (dependentId) return <Redirect href="/dependent" />;
  if (!isAuthenticated) return <Redirect href="/login" />;

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace('/family');
  }

  function finish() {
    router.dismissTo('/family');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {state.status === 'success' ? (
        <CreateFamilyScreen invitation={state.invitation} onBack={finish} onComplete={finish} />
      ) : (
        <FamilyDetailsScreen
          value={details}
          onChange={setDetails}
          onBack={back}
          onNext={() => void register(details)}
          submitting={state.status === 'loading'}
          serverError={state.status === 'error' ? state.message : undefined}
        />
      )}
    </SafeAreaView>
  );
}
