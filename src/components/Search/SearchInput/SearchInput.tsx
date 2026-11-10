import TextInput from '../../Typography/TextInput';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function SearchInput({ value, onChange, onFocus, onSubmit, onClear }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={24} color="#9AA3B1" />
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        placeholder="약 이름, 성분명으로 검색"
        placeholderTextColor="#9AA3B1"
        style={styles.input}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!!value && (
        <Pressable onPress={onClear} hitSlop={8} accessibilityRole="button" accessibilityLabel="검색어 지우기">
          <Ionicons name="close-circle" size={22} color="#AAB1BB" />
        </Pressable>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { minHeight: 58, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#D9DDE3', borderRadius: 15, paddingHorizontal: 14, marginBottom: 18 },
  input: { flex: 1, color: '#171C26', fontFamily: 'Pretendard', fontSize: 20, marginLeft: 10, paddingVertical: 10 },
});
