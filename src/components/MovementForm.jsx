import { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants';

const emptyForm = {
  type: 'income',
  concept: '',
  amount: '',
  category: CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  notes: ''
};

export default function MovementForm({ onSubmit, editingMovement, onCancel }) {
  const [form, setForm] = useState(editingMovement || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editingMovement || emptyForm);
    setErrors({});
  }, [editingMovement]);

  const validate = () => {
    const nextErrors = {};
    if (!form.concept.trim()) nextErrors.concept = 'El concepto es obligatorio.';
    if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'El importe debe ser mayor que 0.';
    if (!form.date) nextErrors.date = 'La fecha es obligatoria.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      amount: Number(form.amount)
    });

    if (!editingMovement) {
      setForm(emptyForm);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editingMovement ? 'Editar movimiento' : 'Nuevo movimiento'}</h2>
      <div className="grid">
        <label>
          Tipo
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>
        </label>

        <label>
          Categoría
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Concepto
          <input
            value={form.concept}
            onChange={(e) => setForm((prev) => ({ ...prev, concept: e.target.value }))}
            aria-invalid={Boolean(errors.concept)}
            aria-describedby={errors.concept ? 'concept-error' : undefined}
          />
          {errors.concept && (
            <span id="concept-error" className="error">
              {errors.concept}
            </span>
          )}
        </label>

        <label>
          Importe
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          {errors.amount && (
            <span id="amount-error" className="error">
              {errors.amount}
            </span>
          )}
        </label>

        <label>
          Fecha
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <span id="date-error" className="error">
              {errors.date}
            </span>
          )}
        </label>

        <label className="full-width">
          Notas
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </label>
      </div>

      <div className="actions">
        <button type="submit">{editingMovement ? 'Guardar cambios' : 'Añadir movimiento'}</button>
        {editingMovement && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
