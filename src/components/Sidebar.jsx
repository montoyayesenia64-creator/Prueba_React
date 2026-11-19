import { NavLink } from "react-router-dom";
import { Icon } from "./UI";
const options = [
  ["dashboard", "Panel de Control", "grid-1x2"],
  ["materiales", "Materiales", "box-seam"],
  ["pedidos", "Pedidos", "cart3"],
  ["calculos", "Cálculos", "calculator"],
  ["reportes", "Informes", "bar-chart-line"],
  ["usuarios", "Usuarios", "people"],
  ["configuracion", "Configuración", "gear"],
];
export default function Sidebar({
  collapsed,
  onToggle,
  onNewJob,
  onHelp,
  onLogout,
  onNavigate,
}) {
  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      aria-label="Menú principal"
    >
      <NavLink className="sidebar-marca" to="/dashboard" onClick={onNavigate}>
        <span className="brand-symbol">
          <Icon name="printer" />
        </span>
        <span className="nav-label">PrintSmart 3D</span>
      </NavLink>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        aria-expanded={!collapsed}
      >
        <Icon name={collapsed ? "chevron-right" : "chevron-left"} />
      </button>
      <nav className="sidebar-nav">
        {options.map(([id, name, icon]) => (
          <NavLink
            key={id}
            to={`/${id}`}
            onClick={onNavigate}
            className={({ isActive }) => `nav-item ${isActive ? "activo" : ""}`}
            title={collapsed ? name : undefined}
          >
            <Icon name={icon} />
            <span className="nav-label">{name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button
          type="button"
          className="btn-nuevo-trabajo"
          onClick={onNewJob}
          title="Nuevo trabajo de impresión"
        >
          <Icon name="plus-lg" />
          <span className="nav-label">Nuevo Trabajo de Impresión</span>
        </button>
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-link"
            onClick={onHelp}
            title="Centro de ayuda"
          >
            <Icon name="question-circle" />
            <span className="nav-label">Centro de Ayuda</span>
          </button>
          <button
            type="button"
            className="sidebar-link logout"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            <Icon name="box-arrow-left" />
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
