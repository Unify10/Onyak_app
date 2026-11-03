import { Pressable, StyleSheet, Text, View } from 'react-native';
import NotificationIcon from '../../../../assets/home/notification.svg';

interface notificationData{ 
  notificationCount: number,
  notificationMedications: string[]
}

export default function Notification({ notificationCount, notificationMedications }:notificationData){
  return (
    <View style={styles.notificationContainer}>
      <NotificationIcon/>
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>상호작용 주의 {notificationCount}건</Text>
        <Text style={styles.notificationInfo}>{notificationMedications[0]}과(와) {notificationMedications[1]} 중복 성분이 감지되었습니다.</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D20D0D',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 15,
    width: '95%',
  },
  notificationTextContainer: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 20,
    color: '#D20D0D'
  },
  notificationInfo: {
    fontSize: 16,
    color: '#D20D0D'
  },

});