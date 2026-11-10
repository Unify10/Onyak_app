import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BirthDateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState({ year: 2000, month: 0 });
  const firstDay = new Date(month.year, month.month, 1).getDay();
  const days = new Date(month.year, month.month + 1, 0).getDate();
  function openCalendar() {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(2000, 0, 1);
    setMonth({ year: date.getFullYear(), month: date.getMonth() });
    setVisible(true);
  }
  function moveMonth(offset: number) {
    const date = new Date(month.year, month.month + offset, 1);
    setMonth({ year: date.getFullYear(), month: date.getMonth() });
  }
  return (
    <>
      <View style={styles.inputRow}>
        <TextInput accessibilityLabel="생년월일" placeholder="예시) 2010-01-11" placeholderTextColor="#9CA3AF" value={value} onChangeText={onChange} style={styles.input} maxLength={10} keyboardType="numbers-and-punctuation" />
        <Pressable style={styles.calendarButton} accessibilityRole="button" accessibilityLabel="생년월일 달력 열기" onPress={openCalendar}><Ionicons name="calendar-outline" size={22} color="#8B929D" /></Pressable>
      </View>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <Pressable accessibilityRole="button" accessibilityLabel="달력 닫기" style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={styles.calendar}>
            <View style={styles.monthHeader}>
              <Pressable style={styles.arrow} accessibilityRole="button" accessibilityLabel="이전 달" onPress={() => moveMonth(-1)}><Ionicons name="chevron-back" size={22} /></Pressable>
              <View style={styles.yearRow}>
                <TextInput accessibilityLabel="달력 연도" keyboardType="number-pad" maxLength={4} value={String(month.year)} onChangeText={year => { if (/^\d{1,4}$/.test(year)) setMonth(current => ({ ...current, year: Number(year) })); }} style={styles.year} />
                <Text style={styles.month}>{month.month + 1}월</Text>
              </View>
              <Pressable style={styles.arrow} accessibilityRole="button" accessibilityLabel="다음 달" onPress={() => moveMonth(1)}><Ionicons name="chevron-forward" size={22} /></Pressable>
            </View>
            <View style={styles.grid}>{['일', '월', '화', '수', '목', '금', '토'].map(day => <Text key={day} style={styles.weekday}>{day}</Text>)}</View>
            <View style={styles.grid}>
              {Array.from({ length: firstDay + days }, (_, index) => {
                const day = index - firstDay + 1;
                const date = `${month.year}-${String(month.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                return day < 1 ? <View key={index} style={styles.day} /> : <Pressable key={index} accessibilityRole="button" accessibilityLabel={date} style={[styles.day, date === value && styles.selected]} onPress={() => { onChange(date); setVisible(false); }}><Text style={date === value ? styles.selectedText : styles.dayText}>{day}</Text></Pressable>;
              })}
            </View>
            <Pressable style={styles.close} onPress={() => setVisible(false)} accessibilityRole="button"><Text>닫기</Text></Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  inputRow: { minHeight: 50, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, minWidth: 0, paddingHorizontal: 16, paddingVertical: 14, color: '#111111', fontSize: 16 },
  calendarButton: { minWidth: 46, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  calendar: { width: '100%', maxWidth: 360, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 16 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  arrow: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  year: { fontSize: 18, textAlign: 'center', width: 70, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  month: { fontSize: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', textAlign: 'center', fontSize: 14, color: '#8B929D', paddingVertical: 10 },
  day: { width: '14.2857%', minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  dayText: { fontSize: 16, color: '#111111' },
  selected: { backgroundColor: '#000000' },
  selectedText: { color: '#FFFFFF', fontSize: 16 },
  close: { padding: 14, alignItems: 'center', marginTop: 8 },
});
