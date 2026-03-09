const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportAsJson = (movements) => {
  const blob = new Blob([JSON.stringify(movements, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `movimientos-${new Date().toISOString().slice(0, 10)}.json`);
};

export const exportAsCsv = (movements) => {
  const headers = ['id', 'tipo', 'concepto', 'importe', 'categoria', 'fecha', 'notas'];
  const rows = movements.map((m) =>
    [m.id, m.type, m.concept, m.amount, m.category, m.date, m.notes || '']
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `movimientos-${new Date().toISOString().slice(0, 10)}.csv`);
};
