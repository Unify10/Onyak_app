import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';

const ROW_HEIGHT = 38;
const VISIBLE_ROWS = 5;
const PAD = ROW_HEIGHT * 2;

function Wheel({ label, count, value, onChange }: { label: string; count: number; value: number; onChange: (value: number) => void }) {
  const ref = useRef<ScrollView>(null);
  useEffect(() => { ref.current?.scrollTo({ y: value * ROW_HEIGHT, animated: false }); }, [value]);
  return <View style={styles.wheelColumn}>
    <Text style={styles.wheelLabel}>{label}</Text>
    <View style={styles.wheelViewport}>
      <View pointerEvents="none" style={styles.selectedBand} />
      <ScrollView ref={ref} showsVerticalScrollIndicator={false} snapToInterval={ROW_HEIGHT} decelerationRate="fast" contentContainerStyle={{ paddingVertical: PAD }} onMomentumScrollEnd={event => onChange(Math.max(0, Math.min(count - 1, Math.round(event.nativeEvent.contentOffset.y / ROW_HEIGHT))))}>
        {Array.from({ length: count }, (_, index) => <View key={index} style={styles.wheelRow}><Text style={[styles.wheelText, index === value && styles.wheelTextSelected]}>{String(index).padStart(2, '0')}</Text></View>)}
      </ScrollView>
    </View>
  </View>;
}

export default function TimeWheelPicker({ value, onChange, accessibilityLabel }: { value: string; onChange: (value: string) => void; accessibilityLabel: string }) {
  const [visible, setVisible] = useState(false);
  const [hour, setHour] = useState(Number(value.slice(0, 2)) || 0);
  const [minute, setMinute] = useState(Number(value.slice(3, 5)) || 0);
  function open() { setHour(Number(value.slice(0, 2)) || 0); setMinute(Number(value.slice(3, 5)) || 0); setVisible(true); }
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={`${accessibilityLabel} ${value} 변경`} onPress={open} style={styles.trigger}><Text style={styles.triggerText}>{value}</Text></Pressable>
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="시간 선택 닫기" style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
        <View style={styles.dialog}>
          <Text style={styles.title}>{accessibilityLabel}</Text>
          <View style={styles.wheels}><Wheel label="시" count={24} value={hour} onChange={setHour} /><Text style={styles.separator}>:</Text><Wheel label="분" count={60} value={minute} onChange={setMinute} /></View>
          <View style={styles.actions}><Pressable accessibilityRole="button" onPress={() => setVisible(false)} style={styles.cancel}><Text>취소</Text></Pressable><Pressable accessibilityRole="button" onPress={() => { onChange(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`); setVisible(false); }} style={styles.apply}><Text style={styles.applyText}>확인</Text></Pressable></View>
        </View>
      </View>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  trigger: { width: 106, height: 46, borderWidth: 1, borderColor: '#D9DEE5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  triggerText: { fontSize: 17, color: '#171C26' }, backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { width: '100%', maxWidth: 340, borderRadius: 18, backgroundColor: '#FFFFFF', padding: 20 }, title: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  wheels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }, wheelColumn: { width: 88, alignItems: 'center' }, wheelLabel: { color: '#7B8494', fontSize: 13, marginBottom: 6 },
  wheelViewport: { height: ROW_HEIGHT * VISIBLE_ROWS, width: 82, overflow: 'hidden' }, selectedBand: { position: 'absolute', top: ROW_HEIGHT * 2, left: 0, right: 0, height: ROW_HEIGHT, borderRadius: 8, backgroundColor: '#F1F3F6' },
  wheelRow: { height: ROW_HEIGHT, alignItems: 'center', justifyContent: 'center' }, wheelText: { fontSize: 18, color: '#A1A8B3' }, wheelTextSelected: { fontSize: 21, fontWeight: '600', color: '#111111' }, separator: { fontSize: 22, marginTop: 22, color: '#111111' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 }, cancel: { minWidth: 76, height: 44, alignItems: 'center', justifyContent: 'center' }, apply: { minWidth: 84, height: 44, borderRadius: 10, backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center' }, applyText: { color: '#FFFFFF' },
});
