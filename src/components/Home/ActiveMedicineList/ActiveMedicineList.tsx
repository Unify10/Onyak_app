import Text from '../../Typography/Text';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useMedications } from '../../../providers/MedicationProvider';
import { medicines } from '../../Search/medicineData';
import ActiveMedicineItem from './ActiveMedicineItem';

export default function ActiveMedicineList() {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds } = useMedications();
  const activeMedicines = medicines.filter(medicine => medicineIds.includes(medicine.id));
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>복용 중인 약·영양제</Text>
        <Text style={styles.count}>{activeMedicines.length}개</Text>
      </View>
      {activeMedicines.length ? (
        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          {activeMedicines.map(medicine => <ActiveMedicineItem key={medicine.id} medicineId={medicine.id} activeMedicineTitle={medicine.name} activeMedicineInfo={medicine.category} />)}
        </ScrollView>
      ) : <Text style={styles.empty}>복용 중인 약·영양제가 없습니다. 검색에서 추가해주세요.</Text>}
    </View>
  );
}
const baseStyles = StyleSheet.create({
  container: { width: '100%', gap: 10 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 20, color: '#111111' }, count: { fontSize: 14, color: '#6B7280' },
  list: { gap: 12, paddingBottom: 4 }, empty: { color: '#6B7280', fontSize: 14, lineHeight: 22, paddingVertical: 20 },
});
