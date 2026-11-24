import { StyleSheet } from 'react-native';

export const todayMedicineListStyles = StyleSheet.create({
  todayMedicineListContainer: { gap: 10, width: '100%' },
  todayMedicineListHeader:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
  },
  todayMedicineListHeaderTitle: {
    fontSize: 20,

  },
  todayMedicineListHeaderStatus: {
    fontSize: 16,
    color: '#6B7280',
  },

  columns: { flexDirection: 'row', alignItems: 'stretch', gap: 12, width: '100%' },
  pane: { flex: 1, minWidth: 0, height: 320, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, backgroundColor: '#FAFBFC', padding: 10, gap: 8 },
  paneHeader: { minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2 },
  paneTitle: { color: '#303642', fontSize: 15, fontWeight: '600' },
  paneCount: { color: '#7B8494', fontSize: 13 },
});

export const compactTodayMedicineListStyles = StyleSheet.create({
  columns: { flexDirection: 'column' },
  pane: { height: 240 },
});
