import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import InvitationCode from '../../../components/Family/Invitation/InvitationCode';

function generateCode() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

export default function CreateFamilyScreen({ onBack, onComplete }: { onBack: () => void; onComplete: (invitation: { code: string; expiresAt: number }) => void }) {
  const [now, setNow] = useState(() => Date.now());
  const [invitation, setInvitation] = useState(() => ({ code: generateCode(), expiresAt: now + 10 * 60 * 1000 }));
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const secondsLeft = Math.max(0, Math.ceil((invitation.expiresAt - now) / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  function regenerate() {
    const currentTime = Date.now();
    setNow(currentTime);
    setInvitation({ code: generateCode(), expiresAt: currentTime + 10 * 60 * 1000 });
    setCopied(false);
    setShowQr(false);
    setError('');
  }

  async function copyCode() {
    try {
      await Clipboard.setStringAsync(invitation.code);
      setCopied(true);
      setError('');
    } catch {
      setError('코드를 복사하지 못했습니다. 코드를 길게 눌러 복사해주세요.');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="가족 화면으로 돌아가기"><Ionicons name="arrow-back" size={22} color="#000000" /></Pressable>
        <Text style={styles.title}>피보호자 계정 생성</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.codeSection}>
          <InvitationCode code={invitation.code} secondsLeft={secondsLeft} copied={copied} onCopy={() => void copyCode()} />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>
        <View style={styles.actions}>
          <Text style={styles.instruction}>연동 코드를 피보호자 계정에서 입력해주세요.</Text>
          <Pressable accessibilityRole="button" style={styles.outlineButton} onPress={regenerate}><Text style={styles.buttonLabel}>연동 코드 재생성</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: showQr, disabled: secondsLeft === 0 }} disabled={secondsLeft === 0} style={[styles.outlineButton, secondsLeft === 0 && styles.disabled]} onPress={() => setShowQr(current => !current)}><Text style={styles.buttonLabel}>{showQr ? 'QR 닫기' : 'QR 생성'}</Text></Pressable>
          {showQr && secondsLeft > 0 && (
            <View style={styles.qr} accessibilityLabel="테스트용 가족 연동 QR 코드">
              <QRCode value={JSON.stringify({ type: 'onyak-demo-family', code: invitation.code, expiresAt: invitation.expiresAt })} size={180} quietZone={12} />
              <Text style={styles.qrLabel}>피보호자 기기에서 QR 코드를 스캔해주세요.</Text>
            </View>
          )}
          <Text style={styles.demoNote}>화면 테스트용 코드입니다. 실제 계정 연동은 아직 연결되지 않았습니다.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => onComplete(invitation)}><Text style={styles.primaryText}>완료</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  back: { width: 38, height: 38, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '500', color: '#111111' },
  headerSpacer: { width: 38 },
  content: { flexGrow: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  codeSection: { minHeight: 320, flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  error: { fontSize: 13, lineHeight: 20, color: '#D92D20', textAlign: 'center' },
  actions: { padding: 20, gap: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB' },
  instruction: { fontSize: 15, lineHeight: 24, color: '#111111', textAlign: 'center', marginBottom: 2 },
  outlineButton: { minHeight: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 12 },
  buttonLabel: { fontSize: 16, lineHeight: 24, color: '#111111' },
  disabled: { opacity: 0.4 },
  qr: { alignItems: 'center', gap: 14, paddingVertical: 12 },
  qrLabel: { fontSize: 13, lineHeight: 20, color: '#6B7280', textAlign: 'center' },
  demoNote: { fontSize: 12, lineHeight: 18, color: '#8B929D', textAlign: 'center' },
  footer: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 20, paddingTop: 24 },
  primaryButton: { minHeight: 50, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', padding: 12 },
  primaryText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
});
