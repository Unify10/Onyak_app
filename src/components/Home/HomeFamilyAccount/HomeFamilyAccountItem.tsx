import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

interface familyAccountData {
  familyAccountName: string,
  familyAccountImage?: string
}

export default function HomeFamilyAccountItem({ familyAccountName, familyAccountImage }:familyAccountData) {
  return(
    <View style={styles.homeFamilyAccountProfile}>
      <View style={styles.homeFamilyAccountImageContainer}>
        {familyAccountImage ? (
                  <Image source={{ uri : familyAccountImage}}
                  style={styles.homeFamilyAccountImage}
                  resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.homeFamilyAccountImage, styles.placeholderImage]} />
                )}
      </View>
      <View>
        <Text style={styles.homeFamilyAccountName}>{familyAccountName}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  homeFamilyAccountProfile: {
    width: 50,
    alignItems: 'center',
    marginHorizontal: 8,

  },
  homeFamilyAccountImageContainer: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    overflow: 'hidden',
  },
  homeFamilyAccountImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
  },
  homeFamilyAccountName: {
    fontSize: 16,
    textAlign: 'center',

  }
});