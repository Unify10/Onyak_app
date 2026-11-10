import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import React from 'react';
import { StyleSheet, type StyleProp, type TextProps, type TextStyle } from 'react-native';

type Props = TextProps & { style?: StyleProp<TextStyle> };

export default function AppText({ style, ...props }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return <Text {...props} style={[styles.text, style]} />;
}

const baseStyles = StyleSheet.create({ text: { fontSize: 16 } });
