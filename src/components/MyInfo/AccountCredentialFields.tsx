import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';
import TextInput from '../Typography/TextInput';

export function AccountTextField({ label, value, onChange }: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} value={value} onChangeText={onChange} editable={Boolean(onChange)}
        keyboardType={onChange ? 'phone-pad' : 'default'} maxLength={onChange ? 13 : undefined} style={[styles.input, !onChange && styles.readOnly]} />
    </View>
  );
}

export function AccountPasswordField({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordField}>
        <TextInput accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder} secureTextEntry={!visible}
          autoCapitalize="none" autoCorrect={false} maxLength={64} style={[styles.input, styles.passwordInput]} />
        <Pressable accessibilityRole="button" accessibilityLabel={`${label} ${visible ? '숨기기' : '보기'}`} onPress={() => setVisible(value => !value)} style={styles.eye}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: 18, gap: 8 },
  label: { color: '#111111', fontSize: 16, lineHeight: 24 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 12, color: '#111111', fontSize: 16 },
  readOnly: { backgroundColor: '#F5F5F7', color: '#475467' },
  passwordField: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 54 },
  eye: { position: 'absolute', right: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
