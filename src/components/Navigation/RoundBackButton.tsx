import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import AppText from '../Search/AppText/AppText';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export default function RoundBackButton({ onPress, accessibilityLabel, style }: Props) {
  const styles = useResponsiveStyles(baseStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.backButton, style]}
    >
      <AppText style={styles.arrow}>‹</AppText>
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  backButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: { marginTop: -4, color: '#333333', fontSize: 30, lineHeight: 34 },
});
