import type { EvidenceCard } from '../api/evidenceCard';

const severityLabels: Record<string, string> = { CONTRAINDICATED: '금기', CAUTION: '주의' };

export function formatEvidenceCardDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export function getEvidenceCardSections(card: EvidenceCard) {
  return [
    ...card.interactions.map(interaction => ({
      title: [severityLabels[interaction.severity], interaction.kind].filter(Boolean).join(' · '),
      lines: [interaction.item_names.join(' · '), interaction.detail].filter(Boolean),
    })),
    ...card.warnings.map(warning => ({ title: '점검 안내', lines: [warning] })),
    ...card.medications.map(medication => ({
      title: medication.item_name || '약 이름 확인 불가',
      lines: medication.lookup_failed || !medication.findings
        ? ['이 약의 금기·주의 정보를 확인하지 못했어요.']
        : [
          medication.classification,
          ...medication.findings.map(finding => [finding.severity, finding.label, ...finding.details].filter(Boolean).join(' · ')),
          ...medication.evidences.map(evidence => [evidence.source, evidence.detail].filter(Boolean).join(' · ')),
        ].filter(Boolean),
    })),
  ];
}

export function getEvidenceCardText(card: EvidenceCard) {
  return [
    '복약 확인 근거 카드',
    `점검 시각 ${formatEvidenceCardDate(card.generated_at)}`,
    card.headline,
    ...getEvidenceCardSections(card).map(section => [section.title, ...section.lines].join('\n')),
    card.disclaimer,
  ].filter(Boolean).join('\n');
}
