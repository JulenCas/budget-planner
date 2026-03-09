export const toMonthKey = (dateString) => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(dateString));
};

export const monthLabel = (monthKey) => {
  if (!monthKey) return 'Todos los meses';
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  );
};

export const getLast12Months = () => {
  const months = [];
  const today = new Date();
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months.reverse();
};
