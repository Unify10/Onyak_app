import { StyleSheet, Text, View, Image } from 'react-native';
import HomeFamilyAccountItem from './HomeFamilyAccountItem';

export default function HomeFamilyAccountList() {
  return(
    <View style={styles.familyAccountListContainer}>
      <View style={styles.familyAccountListHeader}>
        <Text style={styles.familyAccountListHeaderTitle}>가족 계정</Text>
        <Text style={styles.familyAccountListHeaderStatus}>관리</Text>
      </View>
      <View style={styles.familyAccountList}>
        <HomeFamilyAccountItem familyAccountName='권화월' />
        <HomeFamilyAccountItem familyAccountName='양우찬' />
        <HomeFamilyAccountItem familyAccountName='장건영' />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  familyAccountListContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    gap: 10,
    width: '95%',

  },
  familyAccountListHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
  },
  familyAccountListHeaderTitle: {
    fontSize: 20,

  },
  familyAccountListHeaderStatus: {
    fontSize: 16,
    color: '#6B7280',
  },
  familyAccountList: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  }



});