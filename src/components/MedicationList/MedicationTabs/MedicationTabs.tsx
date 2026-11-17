import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet, View } from 'react-native';

export type MedicationTab = 'current' | 'past' | 'card';

type Props = {
  selectedTab: MedicationTab;
  onSelectTab: (tab: MedicationTab) => void;
  showCard?: boolean;
};

const tabs: { id: MedicationTab; label: string }[] = [
  { id: 'current', label: '현재 복용 중' },
  { id: 'past', label: '지난 기록' },
  { id: 'card', label: '복용 카드' },
];

export default function MedicationTabs({ selectedTab, onSelectTab, showCard = false }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {tabs.filter(({ id }) => showCard || id !== 'card').map(({ id, label }) => (
        <Pressable
          key={id}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedTab === id }}
          onPress={() => onSelectTab(id)}
          style={styles.tab}
        >
          <Text style={[styles.tabLabel, selectedTab === id && styles.activeTabLabel]}>{label}</Text>
          {selectedTab === id && <View style={styles.activeTabLine} />}
        </Pressable>
      ))}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  tabs: { height: 62, flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D9DDE3' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#9AA3B2', fontSize: 17 },
  activeTabLabel: { color: '#111111' },
  activeTabLine: { position: 'absolute', bottom: 0, left: 12, right: 12, height: 2, backgroundColor: '#111111' },
});
