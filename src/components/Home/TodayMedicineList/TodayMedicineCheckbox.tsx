import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet } from 'react-native';
import CheckedIcon from '../../../../assets/home/checked.svg';

type Props = { checked: boolean; onToggle: () => void; label: string };
export default function TodayMedicineCheckbox({ checked, onToggle, label }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={`${label} 복용 완료`}
      accessibilityState={{ checked }}
      hitSlop={6}
      style={[styles.checkboxBase, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}
      onPress={onToggle}
    >
      {checked && <CheckedIcon width={16} height={16} />}
    </Pressable>
  );
}
const baseStyles = StyleSheet.create({
  checkboxBase: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  checkboxChecked: { backgroundColor: '#12C35F', borderColor: '#666666', borderStyle: 'solid' },
  checkboxUnchecked: { backgroundColor: 'transparent', borderColor: '#666666', borderStyle: 'dashed' },
});
