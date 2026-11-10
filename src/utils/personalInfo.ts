export type PersonalInfo = {
  name: string;
  birthDate: string;
  age: string;
  gender: '여성' | '남성' | '선택 안함';
  height: string;
  weight: string;
  pregnant: boolean;
};

export const emptyPersonalInfo: PersonalInfo = { name: '', birthDate: '', age: '', gender: '선택 안함', height: '', weight: '', pregnant: false };

export function isValidBirthDate(value: string, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return year >= 1900 && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date.getTime() <= now;
}

export function validatePersonalInfo(value: PersonalInfo, requireBirthDate = false) {
  if (!value.name.trim()) return '이름을 입력해주세요.';
  if ((requireBirthDate || value.birthDate) && !isValidBirthDate(value.birthDate)) return '생년월일을 YYYY-MM-DD 형식의 올바른 날짜로 입력해주세요.';
  if (value.age && (!/^\d{1,3}$/.test(value.age) || Number(value.age) > 150)) return '연령을 0부터 150 사이의 정수로 입력해주세요.';
  if (value.height && (!Number.isFinite(Number(value.height)) || Number(value.height) <= 0 || Number(value.height) > 300)) return '신장을 0보다 크고 300 이하인 숫자로 입력해주세요.';
  if (value.weight && (!Number.isFinite(Number(value.weight)) || Number(value.weight) <= 0 || Number(value.weight) > 700)) return '몸무게를 0보다 크고 700 이하인 숫자로 입력해주세요.';
  return '';
}
