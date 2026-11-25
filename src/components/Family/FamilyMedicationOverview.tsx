import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import MedicationCautionBadge from '../MedicationList/MedicationCautionBadge';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { isValidDateKey } from '../../utils/medicationSchedule';
import type { PersonalInfo } from '../../utils/personalInfo';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const monthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

type FamilyDose = { id: string; name: string; time: string; caution?: boolean };
type ScheduleOverview = {
  activeCount: number;
  activeMedicationNames?: string[];
  cautionCount?: number;
  getDoses: (date: Date) => FamilyDose[];
};

type OverviewProps = {
  profile: PersonalInfo;
  initialDate?: string;
  profileDetails?: ReactNode;
  schedule?: ScheduleOverview;
  scheduleFeedback?: ReactNode;
};

export default function FamilyMedicationOverview({ profile, initialDate, profileDetails, schedule, scheduleFeedback }: OverviewProps) {
  const styles = useResponsiveStyles(baseStyles);
  const [selectedDate, setSelectedDate] = useState(() => initialDate && isValidDateKey(initialDate) ? new Date(`${initialDate}T00:00:00`) : new Date());
  const [month, setMonth] = useState(selectedDate);
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(0), ...Array.from({ length }, (_, index) => index + 1)];
  }, [month]);

  const selectedDoses = schedule?.getDoses(selectedDate) ?? [];
  const profileText = [
    profile.gender,
    profile.age && `만 ${profile.age}세`,
    profile.height && `${profile.height}cm`,
    profile.weight && `${profile.weight}kg`,
    profile.pregnant && '임신 중',
  ].filter(Boolean).join(' · ');

  function moveMonth(delta: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    setSelectedDate(next);
  }

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="가족 목록으로 돌아가기" style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
      <Text accessibilityRole="header" style={styles.name}>{profile.name}</Text>
      <View style={styles.headerSpacer} />
    </View>
    {profileDetails ? <View style={styles.profileDetails}>{profileDetails}</View> : <Text style={styles.profile}>{profileText}</Text>}
    {scheduleFeedback}
    {schedule && (
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.count}>{schedule.activeCount}개</Text>
          <Text style={styles.summaryLabel}>복용 중</Text>
          {schedule.activeMedicationNames?.map((name, index) => (
            <Text key={`${index}:${name}`} style={styles.medicationName}>{name}</Text>
          ))}
        </View>
        {schedule.cautionCount !== undefined && (
          <View style={[styles.summaryCard, styles.cautionCard]}><Text style={styles.count}>{schedule.cautionCount}개</Text><Text style={styles.summaryLabel}>복용 주의</Text></View>
        )}
      </View>
    )}

    {schedule && (
      <>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable accessibilityRole="button" accessibilityLabel="이전 달" onPress={() => moveMonth(-1)} style={styles.monthArrow}><Ionicons name="chevron-back" size={20} color="#344054" /></Pressable>
            <Text style={styles.monthTitle}>{monthLabel(month)}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="다음 달" onPress={() => moveMonth(1)} style={styles.monthArrow}><Ionicons name="chevron-forward" size={20} color="#344054" /></Pressable>
          </View>
          <View style={styles.calendarGrid}>
            {weekdays.map((day, index) => <Text key={day} style={[styles.weekday, index === 0 && styles.sunday, index === 6 && styles.saturday]}>{day}</Text>)}
            {days.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;
              const active = selectedDate.getFullYear() === month.getFullYear() && selectedDate.getMonth() === month.getMonth() && selectedDate.getDate() === day;
              const weekend = index % 7;
              return <Pressable key={day} accessibilityRole="button" accessibilityLabel={`${month.getFullYear()}년 ${month.getMonth() + 1}월 ${day}일`} accessibilityState={{ selected: active }} onPress={() => setSelectedDate(new Date(month.getFullYear(), month.getMonth(), day))} style={[styles.dayCell, active && styles.selectedDay]}><Text style={[styles.dayText, weekend === 0 && styles.sunday, weekend === 6 && styles.saturday, active && styles.selectedDayText]}>{day}</Text></Pressable>;
            })}
          </View>
        </View>

        <View style={styles.daySection}>
          <Text style={styles.dayTitle}>{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 복용</Text>
          {selectedDoses.length ? selectedDoses.map(dose => (
            <View key={dose.id} style={[styles.dose, dose.caution && styles.cautionDose]}>
              <View style={styles.doseHeading}>
                <Text style={styles.doseName}>{dose.name}</Text>
                {dose.caution && <MedicationCautionBadge />}
              </View>
              <Text style={styles.doseTime}>{dose.time}</Text>
            </View>
          )) : (
            <View style={styles.emptyMedication}>
              <Ionicons name="medical-outline" size={24} color="#98A2B3" />
              <Text style={styles.emptyMedicationText}>등록된 복용 일정이 없습니다.</Text>
            </View>
          )}
        </View>
      </>
    )}
  </ScrollView>;
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 36 },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 8 }, backButton: { minWidth: 42, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 }, name: { flex: 1, fontSize: 22, fontWeight: '600', color: '#111111' }, headerSpacer: { width: 24 }, profile: { fontSize: 14, lineHeight: 22, color: '#667085', marginBottom: 20 },
  profileDetails: { marginBottom: 20 },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 22 }, summaryCard: { flex: 1, minHeight: 98, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E1E4E8', alignItems: 'center', justifyContent: 'center', gap: 3 }, cautionCard: { borderColor: '#FF8A80' }, count: { color: '#111111', fontSize: 24 }, summaryLabel: { color: '#7B8494', fontSize: 14 },
  medicationName: { color: '#344054', fontSize: 14, textAlign: 'center' },
  calendarCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14 }, calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, monthArrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, monthTitle: { fontSize: 18, fontWeight: '600', color: '#111111' }, calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' }, weekday: { width: '14.2857%', height: 40, textAlign: 'center', textAlignVertical: 'center', fontSize: 14, fontWeight: '600', color: '#475467' }, dayCell: { width: '14.2857%', height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 24 }, dayText: { color: '#344054', fontSize: 16 }, sunday: { color: '#F0788B' }, saturday: { color: '#77B7E8' }, selectedDay: { backgroundColor: '#111111' }, selectedDayText: { color: '#FFFFFF' },
  dose: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, gap: 4 },
  cautionDose: { borderColor: '#D92D20' },
  doseHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  doseName: { color: '#111111', fontSize: 16, fontWeight: '600' },
  doseTime: { color: '#667085', fontSize: 14 },
  daySection: { marginTop: 24, gap: 12 }, dayTitle: { fontSize: 18, fontWeight: '600', color: '#111111' }, emptyMedication: { minHeight: 94, borderRadius: 14, backgroundColor: '#F8F9FB', alignItems: 'center', justifyContent: 'center', gap: 7 }, emptyMedicationText: { color: '#7B8494', fontSize: 14 },
});
