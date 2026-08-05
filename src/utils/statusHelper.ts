export interface StatusInfo {
  label: string;
  simpleLabel: string;
  progressPercent: number;
  currentStepIndex: number;
  badgeClass: string;
  isCompleted: boolean;
}

export function getOrderStatusInfo(status?: string): StatusInfo {
  const s = (status || '').toLowerCase().trim();

  if (s === 'pending' || s === 'в ожидании') {
    return {
      label: '⏳ В ожидании',
      simpleLabel: 'В ожидании',
      progressPercent: 15,
      currentStepIndex: 0,
      badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
      isCompleted: false
    };
  }

  if (s === 'in_review' || s === 'in review' || s === 'review' || s === 'на проверке') {
    return {
      label: '🔍 На проверке',
      simpleLabel: 'На проверке',
      progressPercent: 50,
      currentStepIndex: 2,
      badgeClass: 'bg-blue-950/80 text-blue-300 border border-blue-500/40',
      isCompleted: false
    };
  }

  if (s === 'completed' || s === 'завершен' || s === 'выполнен') {
    return {
      label: '✅ Завершен',
      simpleLabel: 'Завершен',
      progressPercent: 100,
      currentStepIndex: 4,
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40',
      isCompleted: true
    };
  }

  // Default: approved / in_progress / in progress / в работе
  return {
    label: '⚡ В работе',
    simpleLabel: 'В работе',
    progressPercent: 65,
    currentStepIndex: 1,
    badgeClass: 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40',
    isCompleted: false
  };
}
