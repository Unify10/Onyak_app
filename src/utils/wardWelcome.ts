export function formatWardWelcome(guardianName?: string) {
  return guardianName
    ? `${guardianName}님의 가족이\n되신 걸 축하합니다!`
    : '가족 계정 연동이 완료되었습니다.';
}
