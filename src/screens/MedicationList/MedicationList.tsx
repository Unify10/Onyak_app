import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { medicines } from '../../components/Search/medicineData';
import { useMedications } from '../../providers/MedicationProvider';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MedicationListHeader from '../../components/MedicationList/MedicationListHeader/MedicationListHeader';
import MedicationSummary from '../../components/MedicationList/MedicationSummary/MedicationSummary';
import MedicationTabs, { MedicationTab } from '../../components/MedicationList/MedicationTabs/MedicationTabs';
import MedicationItem, { Medication } from '../../components/MedicationList/MedicationListContent/MedicationItem';
import MedicationNotice from '../../components/MedicationList/MedicationNotice/MedicationNotice';

const pastMedications: Medication[] = [
  { id: '4', name: '비타민D 2000IU', schedule: '지난 복용 기록', startDate: '2026.10.12 종료' },
  { id: '5', name: '오메가3', schedule: '지난 복용 기록', startDate: '2026.09.30 종료' },
];

export default function MedicationList() {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds } = useMedications();
  const currentMedications: Medication[] = medicines.filter(item => medicineIds.includes(item.id)).map(item => ({ id: item.id, name: item.name, schedule: '복용 일정 미설정', startDate: '복용 목록에 등록됨' }));
  const [selectedTab, setSelectedTab] = useState<MedicationTab>('current');
  const medications = selectedTab === 'current' ? currentMedications : pastMedications;

  return (
    <View style={styles.container}>
      <MedicationListHeader />
      <MedicationSummary currentCount={currentMedications.length} />
      <MedicationTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {medications.length === 0 && <Text style={{ textAlign: 'center', color: '#7B8494', paddingVertical: 40 }}>등록한 약이 없습니다. 검색에서 약을 추가해주세요.</Text>}
        {medications.map((medication) => <MedicationItem key={medication.id} medication={medication} />)}
        {selectedTab === 'current' && <MedicationNotice />}
      </ScrollView>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 16 },
});
