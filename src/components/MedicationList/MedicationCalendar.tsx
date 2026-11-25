import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useWardCalendar } from '../../hooks/useWardCalendar';
import { getMedicationServerClock } from '../../utils/familyMedication';
import { getLocalDateKey, isValidDateKey } from '../../utils/medicationSchedule';
import QueryError from '../Feedback/QueryError';
import SkeletonBlock from '../Skeleton/SkeletonBlock';
import Text from '../Typography/Text';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export function useCalendarDate(initialDate?: string) {
  const [date, setDate] = useState(() => initialDate && isValidDateKey(initialDate)
    ? new Date(`${initialDate}T00:00:00`)
    : getMedicationServerClock().date);
  return { date, setDate };
}

export default function MedicationCalendar({ wardId, role, date, onSelectDate, revision }: {
  wardId?: string;
  role: 'guardian' | 'dependent';
  date: Date;
  onSelectDate: (date: Date) => void;
  revision?: number;
}) {
  const styles = useResponsiveStyles(baseStyles);
  const { state, retry } = useWardCalendar(wardId, date, role, revision);
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const length = new Date(year, month + 1, 0).getDate();
  const days = state.status === 'ready' ? state.data : [];
  const selected = days.find(day => day.date === getLocalDateKey(date));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="이전 달" onPress={() => onSelectDate(new Date(year, month - 1, 1))} style={styles.arrow}><Ionicons name="chevron-back" size={20} color="#344054" /></Pressable>
        <Text accessibilityRole="header" style={styles.heading}>{year}년 {month + 1}월</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="다음 달" onPress={() => onSelectDate(new Date(year, month + 1, 1))} style={styles.arrow}><Ionicons name="chevron-forward" size={20} color="#344054" /></Pressable>
      </View>
      <View style={styles.grid}>
        {weekdays.map((day, index) => <Text key={day} style={[styles.weekday, index === 0 && styles.sunday, index === 6 && styles.saturday]}>{day}</Text>)}
        {Array.from({ length: first }, (_, index) => <View key={`empty-${index}`} style={styles.cell} />)}
        {Array.from({ length }, (_, index) => {
          const day = index + 1;
          const value = new Date(year, month, day);
          const active = day === date.getDate();
          const record = days.find(item => item.date === getLocalDateKey(value));
          const status = record && (record.scheduled > 0 || record.completed > 0) ? `${record.completed}/${record.scheduled}` : '';
          return (
            <Pressable key={day} accessibilityRole="button"
              accessibilityLabel={`${month + 1}월 ${day}일${status ? `, 완료 ${record?.completed}회, 일정 ${record?.scheduled}회` : ''}`}
              accessibilityState={{ selected: active }} onPress={() => onSelectDate(value)}
              style={[styles.cell, active && styles.selected]}>
              <Text style={[styles.day, value.getDay() === 0 && styles.sunday, value.getDay() === 6 && styles.saturday, active && styles.selectedText]}>{day}</Text>
              {!!status && <Text style={[styles.total, active && styles.selectedText]}>{status}</Text>}
            </Pressable>
          );
        })}
      </View>
      {wardId && state.status === 'loading' && <View accessible accessibilityLabel="복약 달력 불러오는 중" accessibilityState={{ busy: true }}><SkeletonBlock style={styles.skeleton} /></View>}
      {wardId && state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {wardId && state.status === 'ready' && (
        <Text style={styles.summary}>{month + 1}월 {date.getDate()}일 · 완료 {selected?.completed ?? 0}회 / 일정 {selected?.scheduled ?? 0}회</Text>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 18, color: '#111111' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', height: 30, textAlign: 'center', fontSize: 14, color: '#475467' },
  cell: { width: '14.2857%', minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  day: { color: '#344054', fontSize: 16 },
  total: { color: '#667085', fontSize: 12 },
  sunday: { color: '#B42318' },
  saturday: { color: '#175CD3' },
  selected: { backgroundColor: '#111111' },
  selectedText: { color: '#FFFFFF' },
  summary: { color: '#475467', fontSize: 14, marginTop: 12 },
  skeleton: { width: 150, height: 16, marginTop: 12 },
});
