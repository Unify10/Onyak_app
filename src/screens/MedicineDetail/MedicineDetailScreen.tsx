import RoundBackButton from '../../components/Navigation/RoundBackButton';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import MedicineInfoAccordion from '../../components/MedicineDetail/MedicineInfoAccordion';
import MedicationScheduleForm from '../../components/MedicineDetail/MedicationScheduleForm';
import type { Medicine } from '../../components/Search/types';
import { useMedications } from '../../providers/MedicationProvider';
import type { DoseTimeOfDay } from '../../utils/medicationSchedule';

export default function MedicineDetailScreen({ medicine }: { medicine: Medicine }) {
  const styles = useResponsiveStyles(baseStyles);
  const { medicineIds, schedules, toggleMedicine, saveMedicationSchedule } = useMedications();
  const isRegistered = medicineIds.includes(medicine.id);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const medicineSchedules = schedules.filter(schedule => schedule.medicineId === medicine.id);

  function saveSchedule(schedule: { startDate: string; durationDays: number; doses: { timeOfDay: DoseTimeOfDay; time: string }[] }) {
    saveMedicationSchedule(medicine.id, schedule.startDate, schedule.durationDays, schedule.doses);
    router.replace('/(tabs)/medication-list');
  }

  function removeMedication() {
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
        <MedicineInfoAccordion />
        {!showScheduleForm && (
          <Pressable accessibilityRole="button" style={styles.button} onPress={() => setShowScheduleForm(true)}>
            <Text style={styles.buttonText}>{isRegistered ? '복용 일정 수정' : '복용 목록에 추가'}</Text>
          </Pressable>
        )}
        {isRegistered && (
          <Pressable accessibilityRole="button" style={styles.removeButton} onPress={removeMedication}>
            <Text style={styles.removeButtonText}>복용 목록에서 제거</Text>
          </Pressable>
        )}
      </ScrollView>
      <Modal transparent visible={showScheduleForm} animationType="fade" onRequestClose={() => setShowScheduleForm(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable accessibilityRole="button" accessibilityLabel="약 일정 설정 닫기" style={StyleSheet.absoluteFill} onPress={() => setShowScheduleForm(false)} />
          <View style={styles.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <MedicationScheduleForm initialSchedules={medicineSchedules} onSave={saveSchedule} onCancel={() => setShowScheduleForm(false)} />
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
  removeButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  removeButtonText: { fontSize: 14, lineHeight: 20, color: '#7B8494' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 520, maxHeight: '92%', borderRadius: 18, overflow: 'hidden', backgroundColor: '#FFFFFF' },
});
