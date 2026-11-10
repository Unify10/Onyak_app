import { createContext, forwardRef, useContext } from 'react';
import { StyleSheet, Text as NativeText, type TextProps, type TextStyle } from 'react-native';
import { getPretendardFamily } from './fontFamily';

const WeightContext = createContext<TextStyle['fontWeight']>('400');
const Text = forwardRef<NativeText, TextProps>(function Text({ style, ...props }, ref) {
  const inheritedWeight = useContext(WeightContext);
  const weight = StyleSheet.flatten(style)?.fontWeight ?? inheritedWeight;
  return (
    <WeightContext.Provider value={weight}>
      <NativeText ref={ref} {...props} style={[style, { fontFamily: getPretendardFamily(weight), fontWeight: 'normal' }]} />
    </WeightContext.Provider>
  );
});
export default Text;
