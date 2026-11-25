import type { DrugInformation } from '../../api/drugs';
import { addFamilyMedication } from '../../api/family';
import ConfirmationDialog from '../../components/Dialogs/ConfirmationDialog';
import RoundBackButton from '../../components/Navigation/RoundBackButton';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import FamilyDrugPrecheck from '../../components/MedicineDetail/FamilyDrugPrecheck';
import FamilyMedicationRegistration from '../../components/MedicineDetail/FamilyMedicationRegistration';
import MedicineInfoAccordion from '../../components/MedicineDetail/MedicineInfoAccordion';
import MedicationScheduleForm, { type FamilyScheduleInput } from '../../components/MedicineDetail/MedicationScheduleForm';
import type { Medicine } from '../../components/Search/types';
import { useAuth } from '../../providers/AuthProvider';
import { useMedications } from '../../providers/MedicationContext';
import { useFamilies } from '../../providers/FamilyProvider';
import type { MedicationScheduleInput } from '../../utils/medicationSchedule';

export default function MedicineDetailScreen({ medicine, information }: { medicine: Medicine; information?: DrugInformation }) {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds, schedules, toggleMedicine, saveMedicationSchedule, rememberMedicine } = useMedications();
  const isRegistered = medicineIds.includes(medicine.id);
  const { families, saveFamilyMedication } = useFamilies();
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const [savingFor, setSavingFor] = useState<'self' | 'family' | 'precheck' | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const { withSession } = useAuth();
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string>();
  const addRequest = useRef<AbortController | null>(null);
  useEffect(() => () => addRequest.current?.abort(), []);
  const drugId = /^drug-(\d{1,20})$/.exec(medicine.id)?.[1];
  const selectedFamily = families.find(family => family.id === familyId);
  const selectedSchedules = savingFor === 'family' ? selectedFamily?.medicationSchedules ?? [] : schedules;
  const medicineSchedules = selectedSchedules.filter(schedule => schedule.medicineId === medicine.id);

  function closeSchedule() {
    if (addRequest.current) return;
    setSavingFor(null);
    setFamilyId(null);
    setAddError(undefined);
  }

  function openCreateFamily() {
    closeSchedule();
    router.push('/create-family');
  }

  async function registerFamilyMedication(wardId: number, schedule: FamilyScheduleInput) {
    if (!drugId || addRequest.current) return;
    const controller = new AbortController();
    addRequest.current = controller;
    setAdding(true);
    setAddError(undefined);
    try {
      await withSession(token => addFamilyMedication(wardId, {
        item_seq: drugId,
        dosage: schedule.dosage,
        start_date: schedule.startDate,
        schedule_times: schedule.times,
      }, token, controller.signal), controller.signal);
      if (controller.signal.aborted) return;
      setSavingFor(null);
      router.replace({ pathname: '/family/[id]', params: { id: String(wardId), date: schedule.startDate } });
    } catch (error) {
      if (!controller.signal.aborted) {
        setAddError(error instanceof Error ? error.message : '가족 계정에 약을 추가하지 못했어요.');
      }
    } finally {
      addRequest.current = null;
      if (!controller.signal.aborted) setAdding(false);
    }
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
        <MedicineInfoAccordion information={information} drugId={drugId} />
        {!savingFor && (
          <Pressable accessibilityRole="button" style={styles.button} onPress={() => setSavingFor('self')}>
            <Text style={styles.buttonText}>{isRegistered ? '복용 일정 수정' : '복용 목록에 추가'}</Text>
          </Pressable>
        )}
        {drugId && (
          <Pressable accessibilityRole="button" style={styles.familyButton} onPress={() => setSavingFor('precheck')}>
            <Text style={styles.familyButtonText}>가족 복용 전 점검</Text>
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
      {savingFor !== null && (
        <Modal transparent visible animationType="fade" onRequestClose={closeSchedule}>
          <View style={styles.modalBackdrop}>
            <Pressable accessibilityRole="button" accessibilityLabel={savingFor === 'precheck' ? '복용 전 점검 닫기' : '약 일정 설정 닫기'} style={StyleSheet.absoluteFill} onPress={closeSchedule} />
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {savingFor === 'precheck' && drugId ? (
                  <FamilyDrugPrecheck drugId={drugId} onClose={closeSchedule} />
                ) : savingFor === 'family' && drugId ? (
                  <FamilyMedicationRegistration
                    busy={adding}
                    saveError={addError}
                    onCancel={closeSchedule}
                    onCreateFamily={openCreateFamily}
                    onSave={(family, schedule) => void registerFamilyMedication(family.ward_id, schedule)}
                  />
                ) : savingFor === 'family' && !selectedFamily ? (
                  <View style={styles.familyPicker}>
                    <Text accessibilityRole="header" style={styles.familyTitle}>약을 추가할 가족 선택</Text>
                    {families.length ? families.map(family => {
                      const isAdded = family.medicationSchedules?.some(schedule => schedule.medicineId === medicine.id);
                      return (
                        <Pressable key={family.id} accessibilityRole="button" style={styles.familyOption} onPress={() => setFamilyId(family.id)}>
                          <Text style={styles.familyButtonText}>{family.details.name}</Text>
                          {isAdded && <Text style={styles.familyStatusText}>등록됨 · 일정 수정</Text>}
                        </Pressable>
                      );
                    }) : (
                      <>
                        <Text>등록된 가족 계정이 없어요.</Text>
                        <Pressable accessibilityRole="button" style={styles.familyButton} onPress={openCreateFamily}>
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
      )}
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
  buttonText: { fontSize: 16, lineHeight: 24, fontWeight: '400', color: '#FFFFFF' },
  familyButton: { minHeight: 48, marginTop: 12, padding: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  familyButtonText: { color: '#111111', fontSize: 16, fontWeight: '400' },
  familyPicker: { padding: 20, gap: 10 },
  familyTitle: { fontSize: 19, fontWeight: '600', color: '#111111' },
  familyOption: { minHeight: 48, padding: 12, gap: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  familyFormTitle: { paddingHorizontal: 20, paddingTop: 18, fontSize: 16, fontWeight: '600', color: '#111111' },
  removeButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  removeButtonText: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: '#7B8494' },
  familyStatusText: { fontSize: 14, lineHeight: 20, color: '#7B8494' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 520, maxHeight: '92%', borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFFFF' },
});
