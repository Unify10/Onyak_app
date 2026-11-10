import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View, Image } from 'react-native';

interface familyAccountData {
  familyAccountName: string,
  familyAccountImage?: string
}

export default function HomeFamilyAccountItem({ familyAccountName, familyAccountImage }:familyAccountData) {
  const styles = useResponsiveStyles(baseStyles);
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
        <Text numberOfLines={2} style={styles.homeFamilyAccountName}>{familyAccountName}</Text>
      </View>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  homeFamilyAccountProfile: {
    width: 76,
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