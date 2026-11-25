import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import { MedicationProvider } from '../../providers/MedicationProvider';

export default function DependentLayout() {
  const { dependentId, isAuthenticated } = useAuth();
  if (!dependentId) return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;

  return (
    <MedicationProvider key={dependentId} includeExamples={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
        <View style={{ flex: 1 }}><Slot /></View>
        <BottomTabBar dependent />
      </SafeAreaView>
    </MedicationProvider>
  );
}
