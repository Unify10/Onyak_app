import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWardInvitation } from '../../../hooks/useWardInvitation';
import CreateFamilyScreen from '../../../screens/Family/CreateFamily/CreateFamilyScreen';
import Text from '../../Typography/Text';

type Props = { wardId: number };

export default function RecentWardInvitation({ wardId }: Props) {
  const { invitation, busy, error, reissue } = useWardInvitation(wardId);
  const [visible, setVisible] = useState(false);
  const [expiredAt, setExpiredAt] = useState<number>();
  const expiresAt = invitation?.expiresAt;
  const expired = expiresAt !== undefined && expiresAt === expiredAt;

  useEffect(() => {
    if (expiresAt === undefined) return;
    const timer = setTimeout(() => setExpiredAt(expiresAt), Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt]);

  function openInvitation() {
    if (!invitation || Date.now() >= invitation.expiresAt) return;
    setVisible(true);
  }

  async function issueInvitation() {
    if (await reissue()) setVisible(true);
  }

  function closeInvitation() {
    setVisible(false);
  }

  return (
    <View style={styles.actions}>
      {invitation && !expired && (
        <>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} style={[styles.button, busy && styles.disabled]} onPress={openInvitation} disabled={busy}>
            <Text style={styles.label}>발급된 연동 코드 다시 보기</Text>
          </Pressable>
          <Text style={styles.hint}>새로 발급하면 이전 연동 코드와 QR은 만료돼요.</Text>
        </>
      )}
      {expired && <Text style={styles.hint}>연동 코드가 만료됐어요.</Text>}
      <Pressable accessibilityRole="button" accessibilityState={{ busy, disabled: busy }} style={[styles.button, styles.reissueButton, busy && styles.disabled]} onPress={() => void issueInvitation()} disabled={busy}>
        <Text style={[styles.label, styles.reissueLabel]}>{busy ? '연동 코드 발급 중…' : '연동 코드 재발급'}</Text>
      </Pressable>
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      {visible && invitation && (
        <Modal visible onRequestClose={closeInvitation}>
          <SafeAreaView style={styles.screen}>
            <CreateFamilyScreen key={invitation.qrToken} invitation={invitation} onBack={closeInvitation} onComplete={closeInvitation} />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { marginTop: 12, gap: 8 },
  button: { minHeight: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#344054', fontSize: 15 },
  reissueButton: { backgroundColor: '#111111', borderColor: '#111111' },
  reissueLabel: { color: '#FFFFFF' },
  hint: { color: '#667085', fontSize: 13 },
  disabled: { opacity: 0.5 },
  error: { color: '#B42318', fontSize: 14 },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
