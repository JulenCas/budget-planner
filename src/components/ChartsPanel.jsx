import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { CATEGORY_COLORS } from '../constants';

export default function ChartsPanel({ expenseByCategory, monthlyData, onCategoryClick }) {
  const pieData = Object.entries(expenseByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <div className="charts-grid">
      <div className="card chart-box">
        <h2>Distribución de gastos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" onClick={(d) => onCategoryClick(d.name)}>
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8a8a8a'} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `€${v.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card chart-box">
        <h2>Evolución mensual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4e79a7" name="Ingresos" />
            <Bar dataKey="expense" fill="#e15759" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
