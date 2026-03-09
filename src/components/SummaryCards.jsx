export default function SummaryCards({ income, expenses, balance }) {
  return (
    <div className="summary-grid">
      <div className="card summary">
        <h3>Ingresos</h3>
        <p className="positive">€{income.toFixed(2)}</p>
      </div>
      <div className="card summary">
        <h3>Gastos</h3>
        <p className="negative">€{expenses.toFixed(2)}</p>
      </div>
      <div className="card summary">
        <h3>Balance</h3>
        <p className={balance >= 0 ? 'positive' : 'negative'}>€{balance.toFixed(2)}</p>
      </div>
    </div>
  );
}
