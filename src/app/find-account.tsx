import { router } from 'expo-router';
import FindAccountScreen from '../screens/Auth/FindAccountScreen';

export default function FindAccountRoute() {
  return <FindAccountScreen onPressBack={() => router.back()} />;
}
