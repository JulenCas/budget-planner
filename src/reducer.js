import { toMonthKey } from './utils/date';

export const initialState = {
  movements: [],
  filters: {
    month: '',
    category: ''
  },
  budgets: {},
  activeProfile: 'General'
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload };
    case 'ADD_MOVEMENT':
      return { ...state, movements: [action.payload, ...state.movements] };
    case 'UPDATE_MOVEMENT':
      return {
        ...state,
        movements: state.movements.map((m) => (m.id === action.payload.id ? action.payload : m))
      };
    case 'DELETE_MOVEMENT':
      return { ...state, movements: state.movements.filter((m) => m.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_ACTIVE_PROFILE':
      return { ...state, activeProfile: action.payload };
    case 'SET_BUDGET':
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.month]: {
            ...(state.budgets[action.payload.month] || {}),
            [action.payload.category]: action.payload.amount
          }
        }
      };
    default:
      return state;
  }
};

export const selectFilteredMovements = (state) =>
  state.movements.filter((movement) => {
    const monthOk = !state.filters.month || toMonthKey(movement.date) === state.filters.month;
    const categoryOk = !state.filters.category || movement.category === state.filters.category;
    return monthOk && categoryOk;
  });
