import type { DrugInformation } from '../../api/drugs';
import ConfirmationDialog from '../../components/Dialogs/ConfirmationDialog';
import RoundBackButton from '../../components/Navigation/RoundBackButton';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import DrugDurSection from '../../components/MedicineDetail/DrugDurSection';
import MedicineInfoAccordion from '../../components/MedicineDetail/MedicineInfoAccordion';
import MedicationScheduleForm from '../../components/MedicineDetail/MedicationScheduleForm';
import type { Medicine } from '../../components/Search/types';
import { useMedications } from '../../providers/MedicationContext';
import { useFamilies } from '../../providers/FamilyProvider';
import type { MedicationScheduleInput } from '../../utils/medicationSchedule';

export default function MedicineDetailScreen({ medicine, information }: { medicine: Medicine; information?: DrugInformation }) {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds, schedules, toggleMedicine, saveMedicationSchedule, rememberMedicine } = useMedications();
  const isRegistered = medicineIds.includes(medicine.id);
  const { families, saveFamilyMedication } = useFamilies();
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [savingFor, setSavingFor] = useState<'self' | 'family' | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const selectedFamily = families.find(family => family.id === familyId);
  const selectedSchedules = savingFor === 'family' ? selectedFamily?.medicationSchedules ?? [] : schedules;
  const medicineSchedules = selectedSchedules.filter(schedule => schedule.medicineId === medicine.id);

  function closeSchedule() {
    setSavingFor(null);
    setFamilyId(null);
  }

  function saveSchedule(schedule: MedicationScheduleInput) {
    if (savingFor === 'family') {
      if (!selectedFamily) return;
      rememberMedicine(medicine);
      saveFamilyMedication(selectedFamily.id, medicine.id, schedule);
      closeSchedule();
      router.replace({ pathname: '/family/[id]', params: { id: selectedFamily.id, date: schedule.startDate } });
      return;
    }
    rememberMedicine(medicine);
    saveMedicationSchedule(medicine.id, schedule.startDate, schedule.durationDays, schedule.doses);
    closeSchedule();
    router.replace('/(tabs)/medication-list');
  }

  function removeMedication() {
    setConfirmingRemoval(false);
    if (!isRegistered) return;
    toggleMedicine(medicine.id);
    router.replace('/(tabs)/medication-list');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <RoundBackButton
          accessibilityLabel="이전 화면으로 돌아가기"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/search')}
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.image}><Text style={styles.imageText}>약 이미지</Text></View>
          <Text style={styles.name}>{medicine.name}</Text>
        </View>
        <MedicineInfoAccordion information={information} />
        {medicine.id.startsWith('drug-') && <DrugDurSection drugId={medicine.id.slice(5)} />}
        {!savingFor && (
          <Pressable accessibilityRole="button" style={styles.button} onPress={() => setSavingFor('self')}>
            <Text style={styles.buttonText}>{isRegistered ? '복용 일정 수정' : '복용 목록에 추가'}</Text>
          </Pressable>
        )}
        <Pressable accessibilityRole="button" style={styles.familyButton} onPress={() => setSavingFor('family')}>
          <Text style={styles.familyButtonText}>가족 계정에 약 추가</Text>
        </Pressable>
        {isRegistered && (
          <Pressable accessibilityRole="button" style={styles.removeButton} onPress={() => setConfirmingRemoval(true)}>
            <Text style={styles.removeButtonText}>복용 목록에서 제거</Text>
          </Pressable>
        )}
      </ScrollView>
      {confirmingRemoval && (
        <ConfirmationDialog
          visible
          title={`${medicine.name}을(를) 복용 목록에서 제거할까요?`}
          confirmLabel="제거"
          onCancel={() => setConfirmingRemoval(false)}
          onConfirm={removeMedication}
        />
      )}
      <Modal transparent visible={savingFor !== null} animationType="fade" onRequestClose={closeSchedule}>
        <View style={styles.modalBackdrop}>
          <Pressable accessibilityRole="button" accessibilityLabel="약 일정 설정 닫기" style={StyleSheet.absoluteFill} onPress={closeSchedule} />
          <View style={styles.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {savingFor === 'family' && !selectedFamily ? (
                <View style={styles.familyPicker}>
                  <Text accessibilityRole="header" style={styles.familyTitle}>약을 추가할 가족 선택</Text>
                  {families.length ? families.map(family => {
                    const isAdded = family.medicationSchedules?.some(schedule => schedule.medicineId === medicine.id);
                    return (
                      <Pressable key={family.id} accessibilityRole="button" style={styles.familyOption} onPress={() => setFamilyId(family.id)}>
                        <Text style={styles.familyButtonText}>{family.details.name}</Text>
                        {isAdded && <Text style={styles.removeButtonText}>등록됨 · 일정 수정</Text>}
                      </Pressable>
                    );
                  }) : (
                    <>
                      <Text>등록된 가족 계정이 없어요.</Text>
                      <Pressable accessibilityRole="button" style={styles.familyButton} onPress={() => { closeSchedule(); router.push('/create-family'); }}>
                        <Text style={styles.familyButtonText}>가족 계정 생성</Text>
                      </Pressable>
                    </>
                  )}
                  <Pressable accessibilityRole="button" style={styles.removeButton} onPress={closeSchedule}>
                    <Text style={styles.removeButtonText}>취소</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {selectedFamily && <Text style={styles.familyFormTitle}>{selectedFamily.details.name}님의 복용 일정</Text>}
                  <MedicationScheduleForm key={selectedFamily?.id ?? 'self'} initialSchedules={medicineSchedules} onSave={saveSchedule} onCancel={closeSchedule} />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  content: { paddingHorizontal: 20, paddingBottom: 24, width: '100%', maxWidth: 640, alignSelf: 'center' },
  hero: { alignItems: 'center', paddingBottom: 80 },
  image: { width: 150, height: 150, backgroundColor: '#E5E7EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  imageText: { color: '#FFFFFF', fontSize: 12 },
  name: { fontSize: 20, lineHeight: 28, color: '#111111', textAlign: 'center', marginTop: 12 },
  button: { minHeight: 52, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', marginTop: 34, padding: 14 },
  buttonText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF' },
  familyButton: { minHeight: 48, marginTop: 12, padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  familyButtonText: { color: '#111111', fontSize: 16, fontWeight: '600' },
  familyPicker: { padding: 20, gap: 10 },
  familyTitle: { fontSize: 19, fontWeight: '600', color: '#111111' },
  familyOption: { minHeight: 48, padding: 12, gap: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  familyFormTitle: { paddingHorizontal: 20, paddingTop: 18, fontSize: 16, fontWeight: '600', color: '#111111' },
  removeButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  removeButtonText: { fontSize: 14, lineHeight: 20, color: '#7B8494' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 520, maxHeight: '92%', borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFFFF' },
});
