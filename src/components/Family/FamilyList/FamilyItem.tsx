import { StyleSheet, Text, View, Image } from 'react-native';

interface familyItemData {
  familyItemName: string,
  familyItemEmail: string
  familyItemImage?: string
};

export default function FamilyItem({ familyItemName, familyItemEmail, familyItemImage }:familyItemData) {
  return(
    <View style={styles.familyItemContainer}>
      <View style={styles.familyItemImageContainer} >
        {familyItemImage ? (
          <Image source={{ uri : familyItemImage}} 
            style={styles.familyItemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.familyItemImage, styles.placeholderImage]}/>
        )}
      </View>
      <View>
        <Text style={styles.familyItemName}>{familyItemName}</Text>
        <Text style={styles.familyItemEmail}>{familyItemEmail}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  familyItemContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
    borderRadius: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 12,
    gap: 15,
  },

  familyItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    // borderWidth: 2,
    // borderColor: '#E5E7EB',
    // marginBottom: 8,
    overflow: 'hidden',
  },

  familyItemImage: {
    width: '100%',
    height: '100%',
  },

  placeholderImage: {
    backgroundColor: '#F5F5F5',
  },

  familyItemName: {
    fontSize: 20,
  },

  familyItemEmail: {
    fontSize: 16,
    color: '#6B7280'
  },
});