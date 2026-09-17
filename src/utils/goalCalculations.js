function parseLocalDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getProgressPercent(goal) {
  if (!goal.targetAmount) return 0;
  const percent = (goal.savedAmount / goal.targetAmount) * 100;
  return Math.min(100, Math.max(0, percent));
}

export function getRemainingAmount(goal) {
  return Math.max(0, goal.targetAmount - goal.savedAmount);
}

export function getDaysRemaining(goal) {
  const today = startOfDay(new Date());
  const deadline = startOfDay(parseLocalDate(goal.deadline));
  return Math.round((deadline - today) / 86400000);
}

export function getGoalStatus(goal) {
  if (goal.savedAmount >= goal.targetAmount) return 'completed';
  if (getDaysRemaining(goal) < 0) return 'overdue';
  return 'active';
}

export function formatDaysRemainingLabel(goal) {
  const status = getGoalStatus(goal);
  if (status === 'completed') return '🎉 Meta concluída';
  if (status === 'overdue') return 'Prazo encerrado';
  const days = getDaysRemaining(goal);
  return `Faltam ${days} dia${days === 1 ? '' : 's'}`;
}
