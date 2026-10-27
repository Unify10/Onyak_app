import React from 'react';
import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';

type AppTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

export default function AppText({ style, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        { fontSize: 20 },
        style,
        { fontFamily: 'Pretendard' },
      ]}
    />
  );
}