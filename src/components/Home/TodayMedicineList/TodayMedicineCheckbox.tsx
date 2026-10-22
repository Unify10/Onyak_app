import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CheckedIcon from '../../../../assets/home/checked.svg';

export default function TodayMedicineCheckbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.checkboxContainer}>
      <Pressable
        style={[styles.checkboxBase, isChecked ? styles.checkboxChecked : styles.checkboxUnchecked]}
        onPress={() => setIsChecked(!isChecked)}
      >
        {isChecked && <CheckedIcon width={16} height={16} />}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxBase: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checkboxChecked: {
    backgroundColor: '#12C35F',
    borderColor: '#666666',
    borderStyle: 'solid',
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
    borderColor: '#666666',
    borderStyle: 'dashed',
  },

});