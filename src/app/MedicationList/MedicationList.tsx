import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MedicationListHeader from '../../components/MedicationList/MedicationListHeader/MedicationListHeader';
import MedicationSummary from '../../components/MedicationList/MedicationSummary/MedicationSummary';
import MedicationTabs, { MedicationTab } from '../../components/MedicationList/MedicationTabs/MedicationTabs';
import MedicationItem, { Medication } from '../../components/MedicationList/MedicationListContent/MedicationItem';
import MedicationNotice from '../../components/MedicationList/MedicationNotice/MedicationNotice';

const currentMedications: Medication[] = [
  { id: '1', name: '약 이름', schedule: '1일 1회 · 아침, 점심, 저녁', startDate: '----.--.-- 시작', caution: true },
  { id: '2', name: '약 이름', schedule: '1일 1회 · 아침, 저녁', startDate: '----.--.-- 시작' },
  { id: '3', name: '약 이름', schedule: '1일 1회 · 아침', startDate: '----.--.-- 시작' },
];

const pastMedications: Medication[] = [
  { id: '4', name: '약 이름', schedule: '1일 2회 · 아침, 저녁', startDate: '2026.10.12 종료' },
  { id: '5', name: '약 이름', schedule: '1일 1회 · 점심', startDate: '2026.09.30 종료' },
];

export default function MedicationList() {
  const [selectedTab, setSelectedTab] = useState<MedicationTab>('current');
  const medications = selectedTab === 'current' ? currentMedications : pastMedications;

  return (
    <View style={styles.container}>
      <MedicationListHeader />
      <MedicationSummary />
      <MedicationTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {medications.map((medication) => <MedicationItem key={medication.id} medication={medication} />)}
        {selectedTab === 'current' && <MedicationNotice />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 16 },
});
