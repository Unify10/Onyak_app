import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useAuth } from '../../../providers/AuthProvider';
import { StyleSheet, View } from 'react-native';
import { typography } from '../../../theme/tokens';
import HomeNotificationButton from './HomeNotificationButton';

export default function PageTitle({ dependentName }: { dependentName?: string }) {
  const styles = useResponsiveStyles(baseStyles);
  const { accountId, displayName } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.titleText}>
          <Text style={styles.name} numberOfLines={1}>{dependentName ?? displayName}님</Text>
        </View>
        {accountId !== null && !dependentName && <HomeNotificationButton key={accountId} />}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '100%', minHeight: 72, paddingHorizontal: 4, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  titleText: { flex: 1 },
  name: { ...typography.pageTitle },
});
