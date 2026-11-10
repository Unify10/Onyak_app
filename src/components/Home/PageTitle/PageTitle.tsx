import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useAuth } from '../../../providers/AuthProvider';
import { router } from 'expo-router';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { typography } from '../../../theme/tokens';

export default function PageTitle() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  const { displayName } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleText}>
          <Text style={styles.greetingText}>안녕하세요</Text>
          <Text style={styles.name} numberOfLines={1}>{displayName} 님</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="알림 내역" style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <Svg width={styles.notificationIcon.width} height={styles.notificationIcon.height} viewBox="0 0 24 24" fill="none">
            <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 21h4" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '100%', minHeight: 72, paddingHorizontal: 4, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  titleText: { flex: 1 },
  greetingText: { color: '#7B8494', fontSize: 13, lineHeight: 18, position: 'absolute', bottom: '100%' },
  name: { ...typography.pageTitle },
  notificationButton: { width: 48, height: 48, flexShrink: 0, borderRadius: 24, borderWidth: 1.5, borderColor: '#D5D9E0', alignItems: 'center', justifyContent: 'center' },
  notificationIcon: { width: 24, height: 24 },
});

const compactStyles = StyleSheet.create({
  greetingText: { fontSize: 12, lineHeight: 16 },
});
