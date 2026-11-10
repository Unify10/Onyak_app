export type DoseTimeOfDay = '아침' | '점심' | '저녁' | '취침 전' | '공복' | '식사와 관계 없이';

export type MedicationSchedule = {
  id: string;
  medicineId: string;
  daysOfWeek: number[];
  timeOfDay: DoseTimeOfDay;
  time: string;
  isExample?: boolean;
};

export function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getTodayDoses(medicineIds: string[], schedules: MedicationSchedule[], date: Date) {
  const dateKey = getLocalDateKey(date);
  return schedules
    .filter(schedule => medicineIds.includes(schedule.medicineId) && schedule.daysOfWeek.includes(date.getDay()))
    .map(schedule => ({ ...schedule, doseId: `${dateKey}:${schedule.id}` }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getMedicationScheduleLabel(schedules: MedicationSchedule[], medicineId: string) {
  const matching = schedules.filter(schedule => schedule.medicineId === medicineId);
  if (!matching.length) return '복용 일정 미설정';
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return matching.map(schedule => {
    const days = new Set(schedule.daysOfWeek).size === 7 ? '매일' : schedule.daysOfWeek.map(day => weekdays[day]).join('·');
    return `${days} · ${schedule.timeOfDay} ${schedule.time}${schedule.isExample ? ' (예시)' : ''}`;
  }).join(' / ');
}
