import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;
const dimensionProperties = new Set(['width', 'height', 'minWidth', 'minHeight', 'maxHeight', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'top', 'bottom', 'left', 'right']);
const touchStyleName = /button|btn|back|eye|tab$|gender|option|pageArrow|pageNumber|next|primary|save|close|copy|headerSpacer/i;

export function getResponsiveScale(width: number, height: number) {
  if (width > 1024 || (width >= 768 && height >= 600)) return 1;
  return Math.max(0.84, Math.min(1, width / 430, height / 880));
}

export function scaleResponsiveStyles<T extends NamedStyles>(baseStyles: T, scale: number): T {
  if (scale === 1) return baseStyles;
  return Object.fromEntries(Object.entries(baseStyles).map(([name, style]) => {
    const scaled = Object.fromEntries(Object.entries(style).map(([property, value]) => {
      if (typeof value !== 'number') return [property, value];
      if (property === 'fontSize') {
        const minimum = /input|password/i.test(name) ? Math.min(value, 16) : Math.min(value, 14);
        return [property, Math.max(minimum, Math.round(value * scale))];
      }
      if (property === 'lineHeight') return [property, Math.round(value * scale)];
      if (/^(padding|margin|gap|rowGap|columnGap)/.test(property)) return [property, Math.round(value * scale)];
      if (dimensionProperties.has(property) && Math.abs(value) > 2) {
        if (value < 0) return [property, Math.round(value * scale)];
        let minimum = 0;
        if (/^(height|minHeight|width|minWidth)$/.test(property) && touchStyleName.test(name)) minimum = 44;
        if (/^(height|width)$/.test(property) && /checkbox/i.test(name)) minimum = 32;
        return [property, Math.max(minimum, Math.round(value * scale))];
      }
      return [property, value];
    }));
    if (typeof scaled.fontSize === 'number' && typeof scaled.lineHeight === 'number') {
      scaled.lineHeight = Math.max(scaled.lineHeight, scaled.fontSize + 4);
    }
    return [name, scaled];
  })) as T;
}
