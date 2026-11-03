import { StyleSheet, Text, View } from 'react-native';
import FamilyItem from './FamilyItem';

export default function FamilyList() {
  return(
    <View style={styles.familyListContainer}>
      <View style={styles.familyListHeader}>
        <Text style={styles.familyListHeaderTitle}>가족</Text>
        <Text style={styles.familyListHeaderStatus}>인원수</Text>
      </View>
      <View style={styles.familyList}>
        <FamilyItem familyItemName='성이름' familyItemEmail='test@gmail.com'/>
        <FamilyItem familyItemName='성이름' familyItemEmail='test@gmail.com'/>
        <FamilyItem familyItemName='성이름' familyItemEmail='test@gmail.com'/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  familyListContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 10,
    width: '95%',

  },
  familyListHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
  },
  familyListHeaderTitle: {
    fontSize: 20,

  },
  familyListHeaderStatus: {
    fontSize: 16,
    color: '#6B7280',
  },
  familyList: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 10,
  }



});