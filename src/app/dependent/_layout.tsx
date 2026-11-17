import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { useDependentProfile } from '../../hooks/useDependentProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import { MedicationProvider } from '../../providers/MedicationProvider';

import { getTestDependent } from '../../utils/familyInvitation';

export default function DependentLayout() {
  const { dependentId, isAuthenticated } = useAuth();
  const profile = useDependentProfile();
  const testDependent = getTestDependent();
  if (!profile) return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;

  return (
    <MedicationProvider key={dependentId} includeExamples={testDependent?.id === dependentId}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        <View style={{ flex: 1 }}><Slot /></View>
        <BottomTabBar dependent />
      </SafeAreaView>
    </MedicationProvider>
  );
}
