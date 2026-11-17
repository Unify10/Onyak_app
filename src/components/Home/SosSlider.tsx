import { useRef, useState, type ComponentProps } from 'react';
import { PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import { useNotifications } from '../../providers/NotificationProvider';

const thumbSize = 48;
const inset = 4;
const webGestureStyle = { touchAction: 'pan-y', top: inset } as const;

export default function SosSlider({ name }: { name: string }) {
  const { addSosRequest } = useNotifications();
  const [width, setWidth] = useState(0);
  const [offset, setOffset] = useState(0);
  const [armed, setArmed] = useState(false);
  const [sent, setSent] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const webDrag = useRef<{ pointerId: number; startX: number; moved: boolean } | null>(null);
  const travel = Math.max(0, width - thumbSize - inset * 2);
  const canSlide = armed && !sent;

  function send() {
    if (!canSlide) return;
    addSosRequest(name);
    setSent(true);
    setArmed(false);
    setConfirm(false);
  }

  function togglePreparation() {
    webDrag.current = null;
    setOffset(0);
    setConfirm(false);
    setArmed(current => !current);
  }

  const responder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) => canSlide && travel > 0 && dx > 6 && dx > Math.abs(dy),
    onPanResponderMove: (_, { dx }) => setOffset(Math.min(travel, Math.max(0, dx))),
    onPanResponderRelease: (_, { dx }) => {
      setOffset(0);
      if (travel > 0 && dx >= travel * 0.95) send();
    },
    onPanResponderTerminate: () => setOffset(0),
  });

  // 웹에서는 손잡이 밖으로 이동해도 같은 포인터의 드래그를 처리합니다.
  const webHandlers: ComponentProps<typeof View> = {
    onPointerDown: event => {
      const { pointerId, clientX, button } = event.nativeEvent;
      if (!canSlide || travel <= 0 || button !== 0 || webDrag.current) return;
      const target = event.currentTarget as unknown as HTMLElement;
      target.setPointerCapture(pointerId);
      webDrag.current = { pointerId, startX: clientX, moved: false };
    },
    onPointerMove: event => {
      const drag = webDrag.current;
      if (!drag || drag.pointerId !== event.nativeEvent.pointerId) return;
      const dx = event.nativeEvent.clientX - drag.startX;
      drag.moved ||= Math.abs(dx) > 6;
      setOffset(Math.min(travel, Math.max(0, dx)));
    },
    onPointerUp: event => {
      const drag = webDrag.current;
      if (!drag || drag.pointerId !== event.nativeEvent.pointerId) return;
      webDrag.current = null;
      setOffset(0);
      const dx = event.nativeEvent.clientX - drag.startX;
      if (dx >= travel * 0.95 && travel > 0) send();
      else if (!drag.moved && Math.abs(dx) <= 6) setConfirm(true);
    },
    onPointerCancel: () => {
      webDrag.current = null;
      setOffset(0);
    },
  };

  return (
    <View style={styles.section}>
      {!sent && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: armed }}
          onPress={togglePreparation}
          style={styles.prepareButton}
        >
          <Text style={styles.label}>{armed ? 'SOS 준비 취소' : 'SOS 요청 준비'}</Text>
        </Pressable>
      )}
      <View style={[styles.track, !canSlide && !sent && styles.lockedTrack]} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        <Text accessibilityLiveRegion="polite" style={[styles.label, !canSlide && !sent && styles.lockedLabel]}>
          {sent ? 'SOS 요청이 기록됐어요' : armed ? '밀어서 SOS 요청' : '먼저 SOS 요청 준비를 눌러주세요'}
        </Text>
        <View
          {...(canSlide ? (Platform.OS === 'web' ? webHandlers : responder.panHandlers) : {})}
          style={[styles.handle, { left: inset + (sent ? travel : offset) }, canSlide && Platform.OS === 'web' && webGestureStyle]}
        >
          <Pressable
            style={[styles.thumb, !canSlide && !sent && styles.lockedThumb]}
            disabled={!canSlide}
            accessibilityRole="button"
            accessibilityLabel="SOS 요청"
            onPress={event => {
              if (canSlide && (Platform.OS !== 'web' || (event.nativeEvent as { detail?: number }).detail === 0)) setConfirm(true);
            }}
          >
            <Ionicons name={sent ? 'checkmark' : armed ? 'arrow-forward' : 'lock-closed'} size={23} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
      {confirm && canSlide && (
        <View style={styles.confirm}>
          <Text>SOS 요청을 기록할까요?</Text>
          <Pressable accessibilityRole="button" onPress={() => setConfirm(false)}><Text>취소</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={send}><Text style={styles.label}>요청</Text></Pressable>
        </View>
      )}
      <Text style={styles.note}>테스트용 · 이 기기의 앱 알림에 기록돼요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', gap: 8 },
  prepareButton: { minHeight: 44, borderWidth: 1, borderColor: '#D6A09C', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  track: { height: 56, borderRadius: 28, backgroundColor: '#FDE8E7', alignItems: 'center', justifyContent: 'center' },
  lockedTrack: { backgroundColor: '#F2F4F7', paddingLeft: thumbSize + inset * 3, paddingRight: 10 },
  lockedLabel: { color: '#4B5563', fontSize: 14, textAlign: 'center' },
  lockedThumb: { backgroundColor: '#6B7280' },
  label: { color: '#A61B15', fontSize: 16, fontWeight: '600' },
  handle: { position: 'absolute', top: inset },
  thumb: { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2, backgroundColor: '#B42318', alignItems: 'center', justifyContent: 'center' },
  note: { color: '#6B7280', fontSize: 13, textAlign: 'center' },
  confirm: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10, padding: 12 },
});
