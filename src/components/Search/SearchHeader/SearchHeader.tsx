import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';
import { typography } from '../../../theme/tokens';

type Props = { focused: boolean; onBack: () => void };

export default function SearchHeader({ focused, onBack }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.container}>
      {focused ? (
        <Pressable style={styles.back} onPress={onBack} accessibilityRole="button" accessibilityLabel="검색 화면으로 돌아가기">
          <Ionicons name="chevron-back" size={27} color="#171C26" />
          <AppText style={styles.backText}>이전</AppText>
        </Pressable>
      ) : <AppText style={styles.title}>검색</AppText>}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { height: 72, paddingHorizontal: 24, justifyContent: 'center' },
  title: { ...typography.pageTitle },
  back: { alignSelf: 'flex-start', minHeight: 48, flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: '#171C26', fontSize: 18, marginLeft: 2 },
});
