import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';
import { typography } from '../../../theme/tokens';

export default function PageTitle() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>가족</Text>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '100%', height: 72, paddingHorizontal: 4, justifyContent: 'center' },
  title: { ...typography.pageTitle },
});
