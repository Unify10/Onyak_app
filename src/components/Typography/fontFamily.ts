import type { TextStyle } from 'react-native';

export function getPretendardFamily(weight: TextStyle['fontWeight'] = '400') {
  const numericWeight = weight === 'bold' ? 700 : weight === 'normal' ? 400 : Number(weight);
  if (numericWeight >= 800) return 'Pretendard-ExtraBold';
  if (numericWeight >= 700) return 'Pretendard-Bold';
  if (numericWeight >= 600) return 'Pretendard-SemiBold';
  if (numericWeight >= 500) return 'Pretendard-Medium';
  return 'Pretendard';
}
