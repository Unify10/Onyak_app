import { Redirect, useLocalSearchParams } from 'expo-router';
import { medicines } from '../../../components/Search/medicineData';
import MedicineDetailScreen from '../../../screens/MedicineDetail/MedicineDetailScreen';

export default function MedicineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicine = medicines.find(item => item.id === id);
  if (!medicine) return <Redirect href="/search" />;
  return <MedicineDetailScreen key={medicine.id} medicine={medicine} />;
}
