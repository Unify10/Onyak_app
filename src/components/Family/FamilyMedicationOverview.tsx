import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import SkeletonBlock from '../Skeleton/SkeletonBlock';
import MedicationCautionBadge from '../MedicationList/MedicationCautionBadge';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { getLocalDateKey } from '../../utils/medicationSchedule';
import { getMedicationServerClock } from '../../utils/familyMedication';
import { checkFamilyMedication } from '../../api/medications';
import { useMedicationMutation } from '../../hooks/useMedicationMutation';
import MedicationCalendar, { useCalendarDate } from '../MedicationList/MedicationCalendar';
import type { PersonalInfo } from '../../utils/personalInfo';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

type FamilyDose = { id: string; name: string; time: string; caution?: boolean; medicationId?: number; active?: boolean };
type ScheduleOverview = {
  activeCount: number;
  activeMedicationNames?: string[];
  cautionCount?: number;
  getDoses: (date: Date) => FamilyDose[];
};

type OverviewProps = {
  profile?: PersonalInfo;
  initialDate?: string;
  profileDetails?: ReactNode;
  schedule?: ScheduleOverview;
  scheduleLoading?: boolean;
  scheduleFeedback?: ReactNode;
  wardId?: string;
  calendarRevision?: number;
  medicationManagement?: ReactNode;
};

export default function FamilyMedicationOverview({ profile, initialDate, profileDetails, schedule, scheduleLoading = false, scheduleFeedback, wardId, calendarRevision = 0, medicationManagement }: OverviewProps) {
  const styles = useResponsiveStyles(baseStyles);
  const { date: selectedDate, setDate: setSelectedDate } = useCalendarDate(initialDate);
  const [checked, setChecked] = useState<{ date: string; ids: string[] }>();
  const [checkCount, setCheckCount] = useState(0);
  const mutation = useMedicationMutation();
  const selectedKey = getLocalDateKey(selectedDate);
  const isToday = selectedKey === getLocalDateKey(getMedicationServerClock().date);
  const days = useMemo(() => {
    const first = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const length = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(0), ...Array.from({ length }, (_, index) => index + 1)];
  }, [selectedDate]);

  const selectedDoses = schedule?.getDoses(selectedDate) ?? [];
  const profileText = profile && [
    profile.gender,
    profile.age && `만 ${profile.age}세`,
    profile.height && `${profile.height}cm`,
    profile.weight && `${profile.weight}kg`,
    profile.pregnant && '임신 중',
  ].filter(Boolean).join(' · ');

  async function recordDose(dose: FamilyDose) {
    const medicationId = dose.medicationId;
    if (!medicationId || selectedKey !== getLocalDateKey(getMedicationServerClock().date)) return;
    const saved = await mutation.run((token, signal) => checkFamilyMedication(medicationId, dose.time, token, signal));
    if (!saved) return;
    setChecked(previous => ({
      date: selectedKey,
      ids: [...(previous?.date === selectedKey ? previous.ids : []), dose.id],
    }));
    setCheckCount(count => count + 1);
  }

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="가족 목록으로 돌아가기" style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
      {profile
        ? <Text accessibilityRole="header" style={styles.name}>{profile.name}</Text>
        : <View style={styles.name}><SkeletonBlock style={styles.headingSkeleton} /></View>}
      <View style={styles.headerSpacer} />
    </View>
    {profileDetails ? <View style={styles.profileDetails}>{profileDetails}</View> : <Text style={styles.profile}>{profileText}</Text>}
    {scheduleFeedback}
    {scheduleLoading && <FamilyScheduleSkeleton days={days} styles={styles} />}
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
        <MedicationCalendar wardId={wardId} role="guardian" date={selectedDate} onSelectDate={setSelectedDate} revision={calendarRevision + checkCount} />

        <View style={styles.daySection}>
          <Text style={styles.dayTitle}>{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 복용</Text>
          {mutation.error && <Text accessibilityRole="alert" style={styles.checkError}>{mutation.error}</Text>}
          {selectedDoses.length ? selectedDoses.map(dose => (
            <View key={dose.id} style={[styles.dose, dose.caution && styles.cautionDose]}>
              <View style={styles.doseHeading}>
                <Text style={styles.doseName}>{dose.name}</Text>
                {dose.caution && <MedicationCautionBadge />}
              </View>
              <Text style={styles.doseTime}>{dose.time}</Text>
              {wardId && isToday && dose.active && (checked?.date === selectedKey && checked.ids.includes(dose.id)
                ? <Text style={styles.doseTime}>복용 완료</Text>
                : <Pressable accessibilityRole="button" accessibilityLabel={`${dose.time} ${dose.name} 복용 완료 기록`}
                    onPress={() => void recordDose(dose)} disabled={mutation.busy} style={styles.checkButton}>
                    <Text>복용 완료 기록</Text>
                  </Pressable>)}
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
    {medicationManagement && <View style={styles.management}>{medicationManagement}</View>}
  </ScrollView>;
}

function FamilyScheduleSkeleton({ days, styles }: { days: number[]; styles: typeof baseStyles }) {
  return (
    <View accessible accessibilityLabel="가족 복용 일정 불러오는 중" accessibilityState={{ busy: true }}>
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <SkeletonBlock style={styles.countSkeleton} />
          <SkeletonBlock style={styles.labelSkeleton} />
        </View>
      </View>
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View style={styles.monthArrow}><SkeletonBlock style={styles.calendarDot} /></View>
          <SkeletonBlock style={styles.headingSkeleton} />
          <View style={styles.monthArrow}><SkeletonBlock style={styles.calendarDot} /></View>
        </View>
        <View style={styles.calendarGrid}>
          {weekdays.map(day => (
            <View key={day} style={[styles.dayCell, styles.weekdaySkeleton]}><SkeletonBlock style={styles.calendarDot} /></View>
          ))}
          {days.map((day, index) => (
            <View key={day || `empty-${index}`} style={styles.dayCell}>{day > 0 && <SkeletonBlock style={styles.calendarDot} />}</View>
          ))}
        </View>
      </View>
      <View style={styles.daySection}>
        <SkeletonBlock style={styles.dayTitleSkeleton} />
        <View style={styles.emptyMedication}><SkeletonBlock style={styles.labelSkeleton} /></View>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 36 },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 8 }, backButton: { minWidth: 42, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 }, name: { flex: 1, fontSize: 22, fontWeight: '600', color: '#111111' }, headerSpacer: { width: 24 }, profile: { fontSize: 14, lineHeight: 22, color: '#667085', marginBottom: 20 },
  profileDetails: { marginBottom: 20 },
  headingSkeleton: { width: 110, height: 22 },
  countSkeleton: { width: 40, height: 24 },
  labelSkeleton: { width: 58, height: 14 },
  weekdaySkeleton: { minHeight: 30 },
  calendarDot: { width: 14, height: 14 },
  dayTitleSkeleton: { width: 108, height: 20 },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 22 }, summaryCard: { flex: 1, minHeight: 98, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E1E4E8', alignItems: 'center', justifyContent: 'center', gap: 3 }, cautionCard: { borderColor: '#FF8A80' }, count: { color: '#111111', fontSize: 24 }, summaryLabel: { color: '#7B8494', fontSize: 14 },
  medicationName: { color: '#344054', fontSize: 14, textAlign: 'center' },
  calendarCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monthArrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  management: { marginTop: 24, gap: 12 },
  checkButton: { minHeight: 44, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#F4F5F7', alignSelf: 'flex-start', justifyContent: 'center' },
  checkError: { color: '#B42318' },
  dose: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, gap: 4 },
  cautionDose: { borderColor: '#D92D20' },
  doseHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  doseName: { color: '#111111', fontSize: 16, fontWeight: '600' },
  doseTime: { color: '#667085', fontSize: 14 },
  daySection: { marginTop: 24, gap: 12 }, dayTitle: { fontSize: 18, fontWeight: '600', color: '#111111' }, emptyMedication: { minHeight: 94, borderRadius: 14, backgroundColor: '#F8F9FB', alignItems: 'center', justifyContent: 'center', gap: 7 }, emptyMedicationText: { color: '#7B8494', fontSize: 14 },
});
