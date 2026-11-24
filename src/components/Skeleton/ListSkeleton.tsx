import { StyleSheet, View } from 'react-native';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors } from '../../theme/tokens';
import Text from '../Typography/Text';
import SkeletonBlock from './SkeletonBlock';

type Props = {
  label: string;
  title?: string;
  layout?: 'rows' | 'cards' | 'avatars';
};

export default function ListSkeleton({ label, title, layout = 'rows' }: Props) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);

  return (
    <View accessible accessibilityLabel={label} accessibilityState={{ busy: true }} style={styles.section}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={layout === 'rows' ? styles.list : styles.horizontal}>
        {[0, 1, 2].map(index => {
          if (layout === 'cards') return (
            <View key={index} style={styles.card}>
              <SkeletonBlock style={styles.picture} />
              <SkeletonBlock style={styles.primary} />
              <SkeletonBlock style={styles.secondary} />
            </View>
          );
          if (layout === 'avatars') return (
            <View key={index} style={styles.avatarItem}>
              <SkeletonBlock style={styles.avatar} />
              <SkeletonBlock style={styles.avatarText} />
            </View>
          );
          return (
            <View key={index} style={styles.row}>
              <SkeletonBlock style={styles.avatar} />
              <View style={styles.text}>
                <SkeletonBlock style={styles.primary} />
                <SkeletonBlock style={styles.secondary} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  section: { width: '100%', gap: 12 },
  title: { color: colors.ink, fontSize: 20 },
  list: { gap: 12 },
  horizontal: { flexDirection: 'row', gap: 12, overflow: 'hidden', paddingBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  card: { width: 220, flexShrink: 0, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.border, gap: 12 },
  picture: { width: '100%', height: 110, borderRadius: 10 },
  text: { flex: 1, gap: 7 },
  primary: { width: '52%', height: 16 },
  secondary: { width: '72%', height: 12 },
  avatarItem: { width: 76, marginHorizontal: 8, alignItems: 'center', gap: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  avatarText: { width: '70%', height: 14 },
});

const compactStyles = {
  card: { width: 200, padding: 10 },
  picture: { height: 80 },
};
