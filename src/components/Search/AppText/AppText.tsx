import React from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

type Props = TextProps & { style?: StyleProp<TextStyle> };

export default function AppText({ style, ...props }: Props) {
  return <Text {...props} style={[{ fontSize: 16 }, style]} />;
}
