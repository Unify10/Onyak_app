import { useMemo } from 'react';
import { Dimensions, Platform, useWindowDimensions, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { getResponsiveScale, scaleResponsiveStyles } from '../theme/responsive';

export function useResponsiveStyles<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(baseStyles: T, compactStyles?: { [K in keyof T]?: ViewStyle | TextStyle | ImageStyle }): T {
  const { width, height } = useWindowDimensions();
  // 네이티브에서는 키보드가 열려도 화면 밀도가 바뀌지 않도록 기기 높이를 사용합니다.
  const availableHeight = Platform.OS === 'web' ? height : Dimensions.get('screen').height;
  const scale = getResponsiveScale(width, availableHeight);
  const isCompact = width <= 600 || (width <= 1024 && availableHeight < 600);
  return useMemo(() => {
    if (!isCompact || !compactStyles) return scaleResponsiveStyles(baseStyles, scale);
    const compact = Object.fromEntries(Object.entries(baseStyles).map(([name, style]) => [name, { ...style, ...compactStyles[name] }])) as T;
    return scaleResponsiveStyles(compact, scale);
  }, [baseStyles, compactStyles, isCompact, scale]);
}
