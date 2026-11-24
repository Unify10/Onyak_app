import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';
import { colors, typography } from '../../theme/tokens';

type Props = { message: string; onRetry: () => void };

export default function QueryError({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retry}>
        <Text style={styles.label}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 4 },
  message: { ...typography.body },
  retry: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center', paddingRight: 12 },
  label: { ...typography.caption, color: colors.ink, fontWeight: '600' },
});
