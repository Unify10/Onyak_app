import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  ink: '#111111',
  body: '#303642',
  muted: '#7B8494',
  border: '#E1E4E8',
  surface: '#FFFFFF',
  accent: '#000000',
  error: '#D92D20',
} as const;

export const typography: Record<'pageTitle' | 'sectionTitle' | 'body' | 'caption', TextStyle> = {
  pageTitle: { fontSize: 24, lineHeight: 32, fontWeight: '600', color: colors.ink },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: '600', color: colors.ink },
  body: { fontSize: 16, lineHeight: 24, color: colors.body },
  caption: { fontSize: 13, lineHeight: 18, color: colors.muted },
};

export const medicineImageLayout: ViewStyle = {
  width: '22%',
  minWidth: 64,
  maxWidth: 88,
  aspectRatio: 1,
  flexShrink: 0,
};
