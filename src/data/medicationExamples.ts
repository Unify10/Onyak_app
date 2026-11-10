import type { MedicationSchedule } from '../utils/medicationSchedule';

// 화면과 스크롤을 확인하기 위한 예시이며 실제 복용 지침이 아닙니다.
export const exampleMedicineIds = ['1', '2', '3', '4', '5'];
export const exampleMedicationSchedules: MedicationSchedule[] = [
  { id: 'example-1', medicineId: '1', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], timeOfDay: '아침', time: '08:00', isExample: true },
  { id: 'example-2', medicineId: '2', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], timeOfDay: '아침', time: '09:00', isExample: true },
  { id: 'example-3', medicineId: '3', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], timeOfDay: '점심', time: '12:00', isExample: true },
  { id: 'example-4', medicineId: '4', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], timeOfDay: '저녁', time: '18:00', isExample: true },
  { id: 'example-5', medicineId: '5', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], timeOfDay: '저녁', time: '20:00', isExample: true },
];
