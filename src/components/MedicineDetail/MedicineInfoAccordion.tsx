import type { DrugInformation } from '../../api/drugs';
import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicineInfoAccordion({ information }: { information?: DrugInformation }) {
  const styles = useResponsiveStyles(baseStyles);
  const [expanded, setExpanded] = useState<string | null>('약의 효능');
  const sections = [
    { title: '약의 효능', description: information?.efficacy },
    { title: '복용 방법', description: information?.usage },
    { title: '주의사항', description: information?.caution },
  ];
  return (
    <View style={styles.container}>
      {sections.map((section, index) => {
        const isExpanded = expanded === section.title;
        return (
          <View key={section.title} style={index > 0 && styles.border}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              onPress={() => setExpanded(isExpanded ? null : section.title)}
              style={styles.row}
            >
              <Text style={styles.title}>{section.title}</Text>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#C8CDD5" />
            </Pressable>
            {isExpanded && <View style={styles.description}><Text style={styles.descriptionText}>{section.description?.trim() || '등록된 정보가 없어요.'}</Text></View>}
          </View>
        );
      })}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden' },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  row: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#111111', fontSize: 18, lineHeight: 26 },
  description: { minHeight: 178, backgroundColor: '#F5F6F8', paddingHorizontal: 26, paddingVertical: 28 },
  descriptionText: { fontSize: 16, lineHeight: 26, color: '#111111' },
});
