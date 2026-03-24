import { useEffect, useMemo, useReducer, useState } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import ChartsPanel from './components/ChartsPanel';
import Filters from './components/Filters';
import MovementForm from './components/MovementForm';
import MovementList from './components/MovementList';
import Settings from './components/Settings';
import SummaryCards from './components/SummaryCards';
import { initialState, reducer, selectFilteredMovements } from './reducer';
import { getLast12Months, monthLabel, toMonthKey } from './utils/date';
import { exportAsCsv, exportAsJson } from './utils/export';
import { loadProfiles, loadState, saveProfiles, saveState } from './utils/storage';

export default function App() {
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [profiles, setProfiles] = useState(['General']);
  const [editingMovement, setEditingMovement] = useState(null);

  useEffect(() => {
    const stored = loadState();
    if (stored) dispatch({ type: 'INIT', payload: stored });
    setProfiles(loadProfiles());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  const profileMovements = useMemo(
    () => state.movements.filter((m) => (m.profile || 'General') === state.activeProfile),
    [state.movements, state.activeProfile]
  );

  const filteredMovements = useMemo(
    () => selectFilteredMovements({ ...state, movements: profileMovements }),
    [state, profileMovements]
  );

  const summary = useMemo(() => {
    const income = filteredMovements
      .filter((m) => m.type === 'income')
      .reduce((sum, m) => sum + m.amount, 0);
    const expenses = filteredMovements
      .filter((m) => m.type === 'expense')
      .reduce((sum, m) => sum + m.amount, 0);
    const expenseByCategory = filteredMovements
      .filter((m) => m.type === 'expense')
      .reduce((acc, m) => ({ ...acc, [m.category]: (acc[m.category] || 0) + m.amount }), {});
    return { income, expenses, balance: income - expenses, expenseByCategory };
  }, [filteredMovements]);

  const monthlyData = useMemo(() => {
    const months = getLast12Months();
    return months.map((month) => {
      const monthMovements = profileMovements.filter((m) => toMonthKey(m.date) === month);
      return {
        month: monthLabel(month),
        income: monthMovements.filter((m) => m.type === 'income').reduce((a, b) => a + b.amount, 0),
        expense: monthMovements.filter((m) => m.type === 'expense').reduce((a, b) => a + b.amount, 0)
      };
    });
  }, [profileMovements]);

  const expensePercentages = useMemo(() => {
    if (!summary.expenses) return [];
    return Object.entries(summary.expenseByCategory).map(([category, amount]) => ({
      category,
      pct: ((amount / summary.expenses) * 100).toFixed(1)
    }));
  }, [summary]);

  const addOrUpdateMovement = (movementData) => {
    const payload = {
      ...movementData,
      id: editingMovement?.id || crypto.randomUUID(),
      profile: state.activeProfile
    };

    if (editingMovement) {
      dispatch({ type: 'UPDATE_MOVEMENT', payload });
      setEditingMovement(null);
    } else {
      dispatch({ type: 'ADD_MOVEMENT', payload });
    }
  };

  const visibleMovements = filteredMovements;

  const budgetWarnings = useMemo(() => {
    const month = state.filters.month || new Date().toISOString().slice(0, 7);
    const limits = state.budgets[month] || {};
    return Object.entries(limits)
      .map(([category, max]) => {
        const spent = visibleMovements
          .filter((m) => m.type === 'expense' && m.category === category && toMonthKey(m.date) === month)
          .reduce((sum, m) => sum + m.amount, 0);
        return { category, max, spent, exceeded: spent > max };
      })
      .filter((row) => row.exceeded);
  }, [state.budgets, state.filters.month, visibleMovements]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Budget Planner</h1>
        <nav>
          <NavLink to="/">Movimientos</NavLink>
          <NavLink to="/resumen">Resumen</NavLink>
          <NavLink to="/configuracion">Configuración</NavLink>
        </nav>
      </aside>

      <main>
        {location.pathname === '/' && (
          <div className="floating-export" aria-label="Exportar movimientos">
            <button onClick={() => exportAsCsv(state.movements)}>Exportar CSV</button>
            <button onClick={() => exportAsJson(state.movements)}>Exportar JSON</button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MovementForm
                  editingMovement={editingMovement}
                  onSubmit={addOrUpdateMovement}
                  onCancel={() => setEditingMovement(null)}
                />
                <Filters
                  filters={state.filters}
                  onChange={(payload) => dispatch({ type: 'SET_FILTERS', payload })}
                />
                <MovementList
                  movements={visibleMovements}
                  onEdit={setEditingMovement}
                  onDelete={(id) => dispatch({ type: 'DELETE_MOVEMENT', payload: id })}
                />
              </>
            }
          />
          <Route
            path="/resumen"
            element={
              <>
                <SummaryCards
                  income={summary.income}
                  expenses={summary.expenses}
                  balance={summary.balance}
                />
                {expensePercentages.length > 0 && (
                  <div className="card">
                    <h3>Porcentaje por categoría (gastos)</h3>
                    <ul>
                      {expensePercentages.map((item) => (
                        <li key={item.category}>
                          {item.category}: {item.pct}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <ChartsPanel
                  expenseByCategory={summary.expenseByCategory}
                  monthlyData={monthlyData}
                  onCategoryClick={(category) =>
                    dispatch({ type: 'SET_FILTERS', payload: { category } })
                  }
                />
                {budgetWarnings.length > 0 && (
                  <div className="card warning">
                    <h3>Alertas de presupuesto</h3>
                    {budgetWarnings.map((w) => (
                      <p key={w.category}>
                        Has superado {w.category}: €{w.spent.toFixed(2)} / €{w.max.toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}
              </>
            }
          />
          <Route
            path="/configuracion"
            element={
              <Settings
                profiles={profiles}
                activeProfile={state.activeProfile}
                onProfileChange={(profile) => dispatch({ type: 'SET_ACTIVE_PROFILE', payload: profile })}
                onCreateProfile={(profile) => {
                  if (profiles.includes(profile)) return;
                  setProfiles((prev) => [...prev, profile]);
                }}
                onSetBudget={(payload) => dispatch({ type: 'SET_BUDGET', payload })}
              />
            }
          />
        </Routes>
      </main>

      <footer className="mobile-nav">
        <NavLink to="/">Movimientos</NavLink>
        <NavLink to="/resumen">Resumen</NavLink>
        <NavLink to="/configuracion">Config</NavLink>
      </footer>
    </div>
  );
}
