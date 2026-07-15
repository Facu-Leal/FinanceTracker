import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-house" />
        <span>Inicio</span>
      </NavLink>
      <NavLink to="/movimientos" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-list-ul" />
        <span>Movim.</span>
      </NavLink>
      <div className="bottom-nav-fab">
        <button type="button" className="bottom-nav-fab-button" aria-label="Agregar movimiento" onClick={onAddClick}>
          <i className="bi bi-plus" />
        </button>
      </div>
      <NavLink to="/estadisticas" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-bar-chart" />
        <span>Estad.</span>
      </NavLink>
      <NavLink to="/mas" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-three-dots" />
        <span>Más</span>
      </NavLink>
    </nav>
  );
}
