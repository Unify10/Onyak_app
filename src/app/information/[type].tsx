import { useLocalSearchParams } from 'expo-router';
import AppInformationScreen from '../../screens/MyInfo/AppInformationScreen';

export default function AppInformationRoute() {
  const { type } = useLocalSearchParams<{ type: string }>();
  return <AppInformationScreen type={type} />;
}
