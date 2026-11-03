import { Pressable, StyleSheet, Text, View } from 'react-native';
import CreateFamilyIcon from '../../../../assets/family/createFamilyIcon.svg'

export default function CreateFamily() {
  return (
    <Pressable style={styles.createFamilyContainer}>
      <CreateFamilyIcon/>
      <Text style={styles.createFamilyText}>가족 계정 생성</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  createFamilyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#000000',
    gap: 5,
  },
  createFamilyText: {
    color: '#ffffff',
    fontSize: 20,
  },
});