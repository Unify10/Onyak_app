import type { TextStyle } from 'react-native';

export function getPretendardFamily(weight: TextStyle['fontWeight'] = '400') {
  const numericWeight = weight === 'bold' ? 700 : weight === 'normal' ? 400 : Number(weight);
  // Keep the app on a compact three-step type scale: regular, medium, semibold.
  // This avoids unexpectedly heavy 700/800 text while preserving the Pretendard family.
  if (numericWeight >= 600) return 'Pretendard-SemiBold';
  if (numericWeight >= 500) return 'Pretendard-Medium';
  return 'Pretendard';
}
