import type { NotificationEntry } from '../../components/Notifications/NotificationCard';

type NotificationGroup = { label: string; items: NotificationEntry[] };
// 실제 수신 알림이 아닌 Figma 화면 확인용 예시입니다.
export const notificationExamples: NotificationGroup[] = [
  { label: '오늘', items: [
    { id: 'today-evening', type: 'medication', title: '복용 알림', body: '오후 7시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
    { id: 'today-lunch', type: 'medication', title: '복용 알림', body: '오후 12시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
    { id: 'today-morning', type: 'medication', title: '복용 알림', body: '오전 9시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
  ] },
  { label: '어제', items: [
    { id: 'yesterday-evening', type: 'medication', title: '복용 알림', body: '오후 7시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
    { id: 'yesterday-sos', type: 'sos', title: 'SOS 긴급 알림', body: '긴급 상황이 감지되었어요. 즉시 확인해 주세요.' },
    { id: 'yesterday-lunch', type: 'medication', title: '복용 알림', body: '오후 12시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
    { id: 'yesterday-morning', type: 'medication', title: '복용 알림', body: '오전 9시 복용 시간이에요. 처방된 약을 복용해 주세요.' },
  ] },
];
