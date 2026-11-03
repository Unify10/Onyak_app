import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';

type Props = { onPress: () => void };

export default function CaptureActionPanel({ onPress }: Props) {
  return (
    <View style={styles.panel}>
      <Pressable style={styles.action} onPress={onPress} accessibilityRole="button" accessibilityLabel="라벨 촬영">
        <View style={styles.icon}><Ionicons name="camera-outline" size={29} color="#FFFFFF" /></View>
        <AppText style={styles.title}>라벨 촬영</AppText>
        <AppText style={styles.description}>처방전이나 약품 포장지를 촬영해요</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { minHeight: 220, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: '#D6DAE0', borderRadius: 20, padding: 20, marginBottom: 26 },
  action: { minWidth: 220, minHeight: 180, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#171C26', alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  title: { color: '#171C26', fontSize: 20, fontWeight: '700' },
  description: { color: '#7E8795', fontSize: 16, lineHeight: 22, textAlign: 'center', marginTop: 7 },
});
