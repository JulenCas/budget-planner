import { formatDate } from '../utils/date';

export default function MovementList({ movements, onEdit, onDelete }) {
  return (
    <div className="card">
      <h2>Movimientos</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Importe</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 && (
              <tr>
                <td colSpan={6}>No hay movimientos para los filtros seleccionados.</td>
              </tr>
            )}
            {movements.map((m) => (
              <tr key={m.id}>
                <td>{formatDate(m.date)}</td>
                <td>
                  {m.concept}
                  {m.notes ? <small>{m.notes}</small> : null}
                </td>
                <td>{m.category}</td>
                <td>{m.type === 'income' ? 'Ingreso' : 'Gasto'}</td>
                <td className={m.type === 'income' ? 'positive' : 'negative'}>
                  {m.type === 'income' ? '+' : '-'}€{m.amount.toFixed(2)}
                </td>
                <td>
                  <button className="secondary" onClick={() => onEdit(m)}>
                    Editar
                  </button>
                  <button className="danger" onClick={() => onDelete(m.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
