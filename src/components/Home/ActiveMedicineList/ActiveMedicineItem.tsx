import { StyleSheet, Text, View, Image } from 'react-native';

interface activeMedicineData {
  activeMedicineTitle: string;
  activeMedicineInfo: string;
  activeMedicineImage?: string;
}

export default function ActiveMedicineItem({ activeMedicineTitle, activeMedicineInfo, activeMedicineImage }: activeMedicineData) {
  return (
    <View style={styles.activeMedicineCard}>
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
        <Text style={styles.activeMedicineTitle}>{activeMedicineTitle}</Text>
        <Text style={styles.activeMedicineInfo}>{activeMedicineInfo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeMedicineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 12,
    width: '47.5%',
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
    fontSize: 20,
    marginTop: 10,
  },
  activeMedicineInfo: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
  },
});