import { Link } from 'react-router-dom';

const ITEMS = [
  { to: '/mas/cuentas', icon: 'bi-wallet2', label: 'Cuentas' },
  { to: '/mas/categorias', icon: 'bi-tags', label: 'Categorías' },
  { to: '/mas/presupuestos', icon: 'bi-piggy-bank', label: 'Presupuestos' },
  { to: '/mas/tarjetas', icon: 'bi-credit-card', label: 'Tarjetas y Cuotas' },
  { to: '/mas/gastos-fijos', icon: 'bi-calendar-check', label: 'Gastos Fijos' },
  { to: '/mas/respaldos', icon: 'bi-cloud-arrow-down', label: 'Respaldos' },
  { to: '/mas/configuracion', icon: 'bi-gear', label: 'Configuración' },
];

export function MorePage() {
  return (
    <div>
      <h1 className="h4 mb-3">Más</h1>
      <div className="list-group">
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3"
          >
            <i className={`bi ${item.icon} fs-5 text-primary`} />
            <span>{item.label}</span>
            <i className="bi bi-chevron-right ms-auto text-secondary small" />
          </Link>
        ))}
      </div>
    </div>
  );
}
