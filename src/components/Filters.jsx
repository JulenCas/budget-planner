import { CATEGORIES } from '../constants';

export default function Filters({ filters, onChange }) {
  return (
    <div className="card filters">
      <label>
        Mes
        <input
          type="month"
          value={filters.month}
          onChange={(e) => onChange({ month: e.target.value })}
        />
      </label>
      <label>
        Categoría
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="">Todas</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
