# Budget Planner (React + Vite)

Aplicación de presupuesto personal embebible (sin backend) para registrar ingresos/gastos, visualizar resúmenes y exportar datos.

## Funcionalidades
- Alta, edición y eliminación de movimientos.
- Persistencia en `localStorage`.
- Filtros por mes y categoría.
- Resumen dinámico (ingresos, gastos, balance) y porcentajes de gasto por categoría.
- Gráficas con Recharts (pastel + barras mensuales).
- Exportación a CSV y JSON.
- Múltiples perfiles locales (sin autenticación).
- Presupuesto máximo mensual por categoría con alertas.
- Diseño responsive (sidebar en desktop, navegación inferior en móvil).

## Uso rápido
```bash
npm install
npm run dev
```

## Estructura
- `src/reducer.js`: estado global con `useReducer`.
- `src/components/*`: UI por secciones.
- `src/utils/date.js`: utilidades de fecha.
- `src/utils/export.js`: exportación CSV/JSON.
- `src/utils/storage.js`: persistencia local.

## Embebido
Puede publicarse como SPA estática (`npm run build`) y embeberse en un `iframe` dentro de una web.
