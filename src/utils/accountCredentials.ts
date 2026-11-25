export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits.length === 10
    ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function validatePasswordChange(current: string, password: string, confirmation: string) {
  if (current.length < 8 || current.length > 64) return '현재 비밀번호를 확인해 주세요.';
  if (password.length < 8 || password.length > 64 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return '새 비밀번호는 영문, 숫자, 특수문자를 포함한 8~64자여야 합니다.';
  }
  if (current === password) return '현재 비밀번호와 다른 비밀번호를 입력해 주세요.';
  if (password !== confirmation) return '새 비밀번호가 일치하지 않습니다.';
  return '';
}
