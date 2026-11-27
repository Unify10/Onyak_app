import { StyleSheet, View } from 'react-native';
import Text from '../Typography/Text';

export default function DrugIngredientList({ value }: { value: string }) {
  const ingredients = value.split(/\s*(?:\|+|\r?\n+)\s*|(?=\[M\d{6}\])/i)
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const match = /^\[(M\d{6})\]\s*(.+)$/i.exec(part);
      return match ? { name: match[2], code: match[1] } : { name: part };
    });

  return (
    <View>
      {ingredients.map(({ name, code }, index) => (
        <View key={`${code ?? name}-${index}`} style={[styles.row, index > 0 && styles.divider]}>
          <Text style={styles.name} selectable>{name}</Text>
          {code && <Text style={styles.code} selectable>{code}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 12, paddingVertical: 9 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D6DAE0' },
  name: { flex: 1, minWidth: 0, color: '#111111', fontSize: 16, lineHeight: 23 },
  code: { color: '#667085', fontSize: 12, lineHeight: 18, textAlign: 'right' },
});
