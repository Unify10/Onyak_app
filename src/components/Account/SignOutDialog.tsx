import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SignOutDialog({ visible, onCancel, onConfirm }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.panel} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={styles.title}>로그아웃하시겠습니까?</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={[styles.button, styles.cancel]}>
              <Text>취소</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={({ pressed }) => [styles.button, styles.confirm, (focused || pressed) && styles.focusedBorder]}>
              <Text style={styles.confirmText}>로그아웃</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.45)' },
  panel: { width: '100%', maxWidth: 360, padding: 24, gap: 24, borderRadius: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '600', color: '#111111' },
  actions: { flexDirection: 'row', gap: 10 },
  button: { flex: 1, minHeight: 44, padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: '#F2F4F7' },
  confirm: { backgroundColor: '#B42318', borderWidth: 2, borderColor: 'transparent' },
  focusedBorder: { borderColor: '#111111' },
  confirmText: { color: '#FFFFFF', fontWeight: '600' },
});
