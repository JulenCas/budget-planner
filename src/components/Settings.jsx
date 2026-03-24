import { useState } from 'react';
import { CATEGORIES } from '../constants';

export default function Settings({ profiles, activeProfile, onProfileChange, onCreateProfile, onSetBudget }) {
  const [newProfile, setNewProfile] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');

  return (
    <div className="card settings">
      <h2>Configuración</h2>
      <div className="settings-group">
        <label>
          Perfil activo
          <select value={activeProfile} onChange={(e) => onProfileChange(e.target.value)}>
            {profiles.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nuevo perfil
          <input value={newProfile} onChange={(e) => setNewProfile(e.target.value)} />
        </label>
      </div>
      <div className="actions card-actions">
        <button
          onClick={() => {
            if (!newProfile.trim()) return;
            onCreateProfile(newProfile.trim());
            setNewProfile('');
          }}
        >
          Añadir perfil
        </button>
      </div>

      <h3>Presupuesto por categoría</h3>
      <div className="settings-group">
        <label>
          Mes
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label>
          Categoría
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Presupuesto máximo (€)
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>
      <div className="actions card-actions">
        <button
          onClick={() => {
            if (!amount) return;
            onSetBudget({ month, category, amount: Number(amount) });
            setAmount('');
          }}
        >
          Guardar límite
        </button>
      </div>
    </div>
  );
}
