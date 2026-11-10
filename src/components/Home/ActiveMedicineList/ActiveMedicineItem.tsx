import { router } from 'expo-router';
import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View, Image, Pressable } from 'react-native';

interface activeMedicineData {
  medicineId: string;
  activeMedicineTitle: string;
  activeMedicineInfo: string;
  activeMedicineImage?: string;
}

export default function ActiveMedicineItem({ medicineId, activeMedicineTitle, activeMedicineInfo, activeMedicineImage }: activeMedicineData) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={activeMedicineTitle} onPress={() => router.push({ pathname: '/medicine/[id]', params: { id: medicineId } })} style={styles.activeMedicineCard}>
      <View>
        {activeMedicineImage ? (
          <Image
            source={{ uri: activeMedicineImage }}
            style={styles.activeMedicineImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.activeMedicineImage, styles.activeMedicinePlaceholder]}>
            <Text style={styles.activeMedicinePlaceholderText}>약 이미지</Text>
          </View>
        )}
      </View>
      <View>
        <Text numberOfLines={2} style={styles.activeMedicineTitle}>{activeMedicineTitle}</Text>
        <Text style={styles.activeMedicineInfo}>{activeMedicineInfo}</Text>
      </View>
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  activeMedicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 12,
    width: 220,
    maxWidth: 240,
    flexShrink: 0,
  },
  activeMedicineImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  activeMedicinePlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMedicinePlaceholderText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  activeMedicineTitle: {
    fontSize: 17,
    lineHeight: 24,
    minHeight: 48,
    marginTop: 10,
  },
  activeMedicineInfo: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
  },
});
const compactStyles = StyleSheet.create({ activeMedicineCard: { width: 200, padding: 10 }, activeMedicineImage: { height: 80 }, activeMedicineTitle: { fontSize: 16, lineHeight: 22, minHeight: 44, marginTop: 6 }, activeMedicineInfo: { fontSize: 14 } });
