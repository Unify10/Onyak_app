import React from 'react';
import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';

// -----------------------------------------------------------------------------
// 공통 텍스트 컴포넌트 속성
// -----------------------------------------------------------------------------

type AppTextProps = TextProps & {
  style?: StyleProp<TextStyle>;
};

// 앱 기본 글꼴과 기본 크기를 모든 화면에서 동일하게 적용합니다.
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
