import type { Medicine } from './types';

export const medicines: Medicine[] = [
  { id: '1', name: '타이레놀정 500mg', ingredient: '아세트아미노펜', kind: '해열·진통제', category: '일반의약품' },
  { id: '2', name: '판콜에이 내복액', ingredient: '아세트아미노펜 외', kind: '종합 감기약', category: '일반의약품' },
  { id: '3', name: '애드빌 리퀴겔', ingredient: '이부프로펜', kind: '소염·진통제', category: '일반의약품' },
  { id: '4', name: '비타민D 2000IU', ingredient: '비타민D', kind: '비타민 보충', category: '영양제' },
  { id: '5', name: '오메가3', ingredient: 'EPA 및 DHA 함유 유지', kind: '건강기능식품', category: '영양제' },
];

if (__DEV__) {
  // 실제 약품과 혼동하지 않도록 가상 항목에서만 경고를 검증합니다.
  medicines.push({
    id: 'demo-contraindication',
    name: '금기 경고 테스트용 가상 약',
    ingredient: '테스트 데이터',
    kind: '만 12세 이하 또는 임신 중 경고 테스트',
    category: '일반의약품',
    contraindications: { ageRanges: [{ throughAge: 12 }], pregnancy: true },
  });
}
