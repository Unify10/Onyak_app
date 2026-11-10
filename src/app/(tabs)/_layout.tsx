import { Redirect, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import { useAuth } from '../../providers/AuthProvider';

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}
