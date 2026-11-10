import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import CreateFamilyIcon from '../../../../assets/family/createFamilyIcon.svg'

export default function CreateFamily() {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  return (
    <Pressable style={styles.createFamilyContainer} onPress={() => router.push('/create-family')} accessibilityRole="button" accessibilityLabel="가족 계정 생성">
      <CreateFamilyIcon width={styles.createFamilyIcon.width} height={styles.createFamilyIcon.height} />
      <Text style={styles.createFamilyText}>가족 계정 생성</Text>
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  createFamilyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#000000',
    gap: 5,
  },
  createFamilyIcon: { width: 48, height: 48 },
  createFamilyText: {
    color: '#ffffff',
    fontSize: 20,
  },
});
const compactStyles = StyleSheet.create({ createFamilyContainer: { padding: 12, gap: 4 }, createFamilyIcon: { width: 32, height: 32 }, createFamilyText: { fontSize: 16, lineHeight: 22 } });
