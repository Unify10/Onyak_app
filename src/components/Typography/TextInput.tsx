import { forwardRef } from 'react';
import { StyleSheet, TextInput as NativeTextInput, type TextInputProps } from 'react-native';
import { getPretendardFamily } from './fontFamily';

const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput({ style, ...props }, ref) {
  const weight = StyleSheet.flatten(style)?.fontWeight;
  return <NativeTextInput ref={ref} {...props} style={[style, { fontFamily: getPretendardFamily(weight), fontWeight: 'normal' }]} />;
});
export default TextInput;
