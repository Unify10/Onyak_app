import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export default function PageTitle() {
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>안녕하세요</Text>
        <Text style={styles.name}>김민지 님</Text>
      </View>
      <View accessibilityRole="image" accessibilityLabel="알림" style={styles.notificationButton}>
        <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
          <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M10 21h4" stroke="#111111" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
        <View style={styles.notificationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 4, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { gap: 2 },
  greetingText: { color: '#7B8494', fontSize: 22 },
  name: { color: '#111111', fontSize: 30, fontWeight: '600' },
  notificationButton: { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: '#D5D9E0', alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', width: 17, height: 17, top: 11, right: 11, borderRadius: 9, backgroundColor: '#FF3434' },
});
