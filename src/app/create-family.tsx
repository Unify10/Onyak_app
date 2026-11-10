import { useFamilies } from '../providers/FamilyProvider';
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../providers/AuthProvider';
import CreateFamilyScreen from '../screens/Family/CreateFamily/CreateFamilyScreen';
import FamilyDetailsScreen from '../screens/Family/CreateFamily/FamilyDetailsScreen';
import { emptyPersonalInfo } from '../utils/personalInfo';

export default function CreateFamilyRoute() {
  const { addFamily } = useFamilies();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<'details' | 'invitation'>('details');
  const [details, setDetails] = useState({ ...emptyPersonalInfo });
  if (!isAuthenticated) return <Redirect href="/login" />;
  function back() { if (router.canGoBack()) router.back(); else router.replace('/family'); }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {step === 'details' ? <FamilyDetailsScreen value={details} onChange={setDetails} onBack={back} onNext={() => setStep('invitation')} /> : <CreateFamilyScreen onBack={() => setStep('details')} onComplete={invitation => { addFamily(details, invitation.expiresAt); router.replace('/family'); }} />}
    </SafeAreaView>
  );
}
