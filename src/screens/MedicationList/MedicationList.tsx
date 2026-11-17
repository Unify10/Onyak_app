import { needsMedicationCaution } from '../../utils/medicationCaution';
import type { PersonalInfo } from '../../utils/personalInfo';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { medicines } from '../../components/Search/medicineData';
import { useMedications } from '../../providers/MedicationProvider';
import { getMedicationPeriodLabel, getMedicationScheduleLabel } from '../../utils/medicationSchedule';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MedicationListHeader from '../../components/MedicationList/MedicationListHeader/MedicationListHeader';
import MedicationSummary from '../../components/MedicationList/MedicationSummary/MedicationSummary';
import MedicationTabs, { MedicationTab } from '../../components/MedicationList/MedicationTabs/MedicationTabs';
import CurrentMedicationCard from '../../components/MedicationList/CurrentMedicationCard';
import MedicationItem, { Medication } from '../../components/MedicationList/MedicationListContent/MedicationItem';

const pastMedications: Medication[] = [
  { id: '4', name: '비타민D 2000IU', schedule: '지난 복용 기록', startDate: '2026.10.12 종료' },
  { id: '5', name: '오메가3', schedule: '지난 복용 기록', startDate: '2026.09.30 종료' },
];

export default function MedicationList({ dependent = false, dependentProfile }: { dependent?: boolean; dependentProfile?: PersonalInfo }) {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds, schedules } = useMedications();
  const registeredMedicines = medicines.filter(item => medicineIds.includes(item.id));
  const currentMedications: Medication[] = registeredMedicines.map(item => ({
    caution: needsMedicationCaution(item.contraindications, dependentProfile),
    id: item.id,
    name: item.name,
    schedule: getMedicationScheduleLabel(schedules, item.id),
    startDate: getMedicationPeriodLabel(schedules, item.id),
  }));
  const cautions = currentMedications.filter(medication => medication.caution);
  const cautionIds = new Set(cautions.map(medication => medication.id));
  const [selectedTab, setSelectedTab] = useState<MedicationTab>('current');
  const records = dependent ? [] : pastMedications;
  const medications = selectedTab === 'current' ? currentMedications : records;

  return (
    <View style={styles.container}>
      <MedicationListHeader hideAdd={dependent} />
      <MedicationSummary currentCount={currentMedications.length} cautionCount={cautions.length} recordCount={records.length} />
      <MedicationTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} showCard={dependent} />
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {selectedTab === 'card' ? (
          <CurrentMedicationCard name={dependentProfile?.name} medicines={registeredMedicines} schedules={schedules} cautionIds={cautionIds} />
        ) : (
          <>
            {medications.length === 0 && <Text style={styles.empty}>{selectedTab === 'past' ? '지난 복용 기록이 없습니다.' : '등록한 약이 없습니다.'}{!dependent && selectedTab === 'current' && ' 검색에서 약을 추가해주세요.'}</Text>}
            {medications.map((medication) => <MedicationItem key={medication.id} medication={medication} readOnly={dependent} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 16 },
  empty: { textAlign: 'center', color: '#7B8494', paddingVertical: 40 },
});
