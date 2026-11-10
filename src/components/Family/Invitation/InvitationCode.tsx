import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { code: string; secondsLeft: number; copied: boolean; onCopy: () => void };

export default function InvitationCode({ code, secondsLeft, copied, onCopy }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return (
    <View style={styles.container}>
      <View style={styles.codeRow}>
        <Text selectable style={styles.code}>{code}</Text>
        <Pressable onPress={onCopy} disabled={secondsLeft === 0} accessibilityRole="button" accessibilityLabel="연동 코드 복사" style={styles.copy}>
          <Ionicons name={copied ? 'checkmark-outline' : 'clipboard-outline'} size={30} color="#9B9B9B" />
        </Pressable>
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.copied}>{copied ? '연동 코드가 복사되었습니다.' : ' '}</Text>
      <Text style={styles.remaining}>{secondsLeft === 0 ? '연동 코드가 만료되었습니다.' : `남은 시간: ${minutes}분${String(seconds).padStart(2, '0')}초`}</Text>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 36 },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  code: { fontSize: 48, lineHeight: 64, letterSpacing: 1, color: '#000000' },
  copy: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  copied: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginTop: 4 },
  remaining: { fontSize: 18, lineHeight: 26, color: '#FF3434', marginTop: 36 },
});
