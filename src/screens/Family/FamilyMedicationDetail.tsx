import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const monthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

export default function FamilyMedicationDetail() {
  const styles = useResponsiveStyles(baseStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { families } = useFamilies();
  const family = families.find(item => item.id === id);
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(0), ...Array.from({ length }, (_, index) => index + 1)];
  }, [month]);

  if (!family) return <View style={styles.screen}><Pressable style={styles.backButton} onPress={() => router.replace('/(tabs)/family')}><Ionicons name="chevron-back" size={22} /><Text>가족 목록</Text></Pressable><Text style={styles.empty}>가족 정보를 찾을 수 없습니다.</Text></View>;

  function moveMonth(delta: number) { setMonth(current => new Date(current.getFullYear(), current.getMonth() + delta, 1)); }

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="가족 목록으로 돌아가기" style={styles.backButton} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
      <Text style={styles.name}>{family.details.name}</Text>
      <View style={styles.headerSpacer} />
    </View>
    <Text style={styles.profile}>{family.details.gender} · 만 {family.details.age}세 · {family.details.height}cm · {family.details.weight}kg{family.details.pregnancyStatusProvided && family.details.pregnant ? ' · 임신 중' : ''}</Text>

    <View style={styles.summary}>
      <View style={styles.summaryCard}><Text style={styles.count}>0개</Text><Text style={styles.summaryLabel}>복용 중</Text></View>
      <View style={[styles.summaryCard, styles.cautionCard]}><Text style={styles.count}>0개</Text><Text style={styles.summaryLabel}>복용 주의</Text></View>
    </View>

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
      <View style={styles.emptyMedication}><Ionicons name="medical-outline" size={24} color="#98A2B3" /><Text style={styles.emptyMedicationText}>등록된 복용 일정이 없습니다.</Text></View>
    </View>
  </ScrollView>;
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 36 },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 8 }, backButton: { minWidth: 42, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 }, name: { flex: 1, fontSize: 22, fontWeight: '600', color: '#111111' }, headerSpacer: { width: 24 }, profile: { fontSize: 14, lineHeight: 22, color: '#667085', marginBottom: 20 },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 22 }, summaryCard: { flex: 1, minHeight: 98, borderRadius: 16, borderWidth: 1, borderColor: '#E1E4E8', alignItems: 'center', justifyContent: 'center', gap: 3 }, cautionCard: { borderColor: '#FF8A80' }, count: { color: '#111111', fontSize: 24 }, summaryLabel: { color: '#7B8494', fontSize: 14 },
  calendarCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14 }, calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, monthArrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, monthTitle: { fontSize: 18, fontWeight: '600', color: '#111111' }, calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' }, weekday: { width: '14.2857%', height: 40, textAlign: 'center', textAlignVertical: 'center', fontSize: 14, fontWeight: '600', color: '#475467' }, dayCell: { width: '14.2857%', height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 24 }, dayText: { color: '#344054', fontSize: 16 }, sunday: { color: '#F0788B' }, saturday: { color: '#77B7E8' }, selectedDay: { backgroundColor: '#111111' }, selectedDayText: { color: '#FFFFFF' },
  daySection: { marginTop: 24, gap: 12 }, dayTitle: { fontSize: 18, fontWeight: '600', color: '#111111' }, emptyMedication: { minHeight: 94, borderRadius: 14, backgroundColor: '#F8F9FB', alignItems: 'center', justifyContent: 'center', gap: 7 }, emptyMedicationText: { color: '#7B8494', fontSize: 14 }, empty: { padding: 24, color: '#667085' },
});
