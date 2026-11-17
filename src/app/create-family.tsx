import { useFamilies } from '../providers/FamilyProvider';
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import CreateFamilyScreen from '../screens/Family/CreateFamily/CreateFamilyScreen';
import FamilyDetailsScreen from '../screens/Family/CreateFamily/FamilyDetailsScreen';
import { emptyPersonalInfo } from '../utils/personalInfo';

export default function CreateFamilyRoute() {
  const { addFamily, families } = useFamilies();
  const { isAuthenticated, dependentId } = useAuth();
  const [step, setStep] = useState<'details' | 'invitation'>('details');
  const [details, setDetails] = useState({ ...emptyPersonalInfo });
  if (dependentId) return <Redirect href="/dependent" />;
  if (!isAuthenticated) return <Redirect href="/login" />;
  function back() { if (router.canGoBack()) router.back(); else router.replace('/family'); }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {step === 'details' ? <FamilyDetailsScreen value={details} onChange={setDetails} onBack={back} onNext={() => setStep('invitation')} /> : <CreateFamilyScreen existingCodes={families.map(family => family.code)} onBack={() => setStep('details')} onComplete={invitation => { addFamily(details, invitation); router.replace('/family'); }} />}
    </SafeAreaView>
  );
}
