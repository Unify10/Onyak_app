import { router, useIsFocused } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getNotifications } from '../../../api/notifications';
import { useProtectedQuery } from '../../../hooks/useProtectedQuery';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';

export default function HomeNotificationButton() {
  const styles = useResponsiveStyles(baseStyles);
  const isFocused = useIsFocused();
  const { state } = useProtectedQuery(getNotifications, isFocused);
  const hasUnread = state.status === 'ready' && state.data.some(item => item.is_read === false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasUnread ? '알림 내역, 읽지 않은 알림 있음' : '알림 내역'}
      style={styles.button}
      onPress={() => router.push('/notifications')}
    >
      <Svg width={styles.icon.width} height={styles.icon.height} viewBox="0 0 24 24" fill="none">
        <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 21h4" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
      {hasUnread && <View style={styles.dot} />}
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  button: { width: 48, height: 48, flexShrink: 0, borderRadius: '50%', borderWidth: 1.5, borderColor: '#D5D9E0', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 24, height: 24 },
  dot: { position: 'absolute', top: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#D92D20', borderWidth: 1.5, borderColor: '#FFFFFF' },
});
