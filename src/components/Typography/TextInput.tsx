import { forwardRef, useState } from 'react';
import { Platform, StyleSheet, TextInput as NativeTextInput, type TextInputProps } from 'react-native';
import { getPretendardFamily } from './fontFamily';

// 웹 브라우저의 기본 포커스 링은 바깥 테두리 표시로 대체합니다.
const webFocusReset = { outline: 'none', outlineWidth: 0 };

const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput({ style, onFocus, onBlur, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  const inputStyle = StyleSheet.flatten(style);
  const hasBorder = (inputStyle?.borderWidth ?? 0) > 0;

  return (
    <NativeTextInput
      ref={ref}
      {...props}
      onFocus={event => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={[
        style,
        { fontFamily: getPretendardFamily(inputStyle?.fontWeight), fontWeight: 'normal' },
        Platform.OS === 'web' && webFocusReset,
        focused && hasBorder && { borderColor: '#000000' },
      ]}
    />
  );
});
export default TextInput;
