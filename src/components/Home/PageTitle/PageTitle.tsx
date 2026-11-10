import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useAuth } from '../../../providers/AuthProvider';
import { router } from 'expo-router';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { typography } from '../../../theme/tokens';

export default function PageTitle() {
  const styles = useResponsiveStyles(baseStyles);
  const { displayName } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>안녕하세요</Text>
        <Text style={styles.name}>{displayName} 님</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="알림 내역" style={styles.notificationButton} onPress={() => router.push('/notifications')}>
        <Svg width={styles.notificationIcon.width} height={styles.notificationIcon.height} viewBox="0 0 24 24" fill="none">
          <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M10 21h4" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </Pressable>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '100%', height: 72, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { gap: 2 },
  greetingText: { color: '#7B8494', fontSize: 16, lineHeight: 22 },
  name: { ...typography.pageTitle },
  notificationButton: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: '#D5D9E0', alignItems: 'center', justifyContent: 'center' },
  notificationIcon: { width: 24, height: 24 },
});
