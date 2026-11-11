export type DoseTimeOfDay = '아침' | '점심' | '저녁' | '취침 전' | '공복' | '식사와 관계 없이';

export type MedicationSchedule = {
  id: string;
  medicineId: string;
  daysOfWeek: number[];
  timeOfDay: DoseTimeOfDay;
  time: string;
  startDate?: string;
  endDate?: string;
  isExample?: boolean;
};

export function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isValidDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

export function formatDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-');
  return `${year}.${month}.${day}`;
}

export function getTodayDoses(medicineIds: string[], schedules: MedicationSchedule[], date: Date) {
  const dateKey = getLocalDateKey(date);
  return schedules
    .filter(schedule =>
      medicineIds.includes(schedule.medicineId)
      && schedule.daysOfWeek.includes(date.getDay())
      && (!schedule.startDate || dateKey >= schedule.startDate)
      && (!schedule.endDate || dateKey <= schedule.endDate),
    )
    .map(schedule => ({ ...schedule, doseId: `${dateKey}:${schedule.id}` }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getMedicationScheduleLabel(schedules: MedicationSchedule[], medicineId: string) {
  const matching = schedules.filter(schedule => schedule.medicineId === medicineId);
  if (!matching.length) return '복용 일정 미설정';
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return matching.map(schedule => {
    const days = new Set(schedule.daysOfWeek).size === 7 ? '매일' : schedule.daysOfWeek.map(day => weekdays[day]).join('·');
    return `${days} · ${schedule.timeOfDay} ${schedule.time}`;
  }).join(' / ');
}

export function getMedicationPeriodLabel(schedules: MedicationSchedule[], medicineId: string) {
  const matching = schedules.find(schedule => schedule.medicineId === medicineId && schedule.startDate && schedule.endDate);
  if (!matching?.startDate || !matching.endDate) return '복용 목록에 등록됨';
  return `복용 기간 ${formatDateKey(matching.startDate)} - ${formatDateKey(matching.endDate)}`;
}
