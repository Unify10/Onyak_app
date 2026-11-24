import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = { style: StyleProp<ViewStyle> };

export default function SkeletonBlock({ style }: Props) {
  return <View importantForAccessibility="no" style={[styles.block, style]} />;
}

const styles = StyleSheet.create({
  block: { backgroundColor: '#E7E9ED', borderRadius: 6 },
});
