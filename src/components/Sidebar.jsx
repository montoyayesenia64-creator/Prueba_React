/** @file Menú lateral: marca, navegación, nuevo trabajo, ayuda y cierre de sesión. */
import { NavLink } from "react-router-dom";
import { Icon } from "./UI";
// Cada entrada define [ruta, texto visible, nombre del icono de Bootstrap].
const options = [
  ["dashboard", "Panel de Control", "grid-1x2"],
  ["materiales", "Materiales", "box-seam"],
  ["pedidos", "Pedidos", "cart3"],
  ["calculos", "Cálculos", "calculator"],
  ["reportes", "Informes", "bar-chart-line"],
  ["usuarios", "Usuarios", "people"],
  ["configuracion", "Configuración", "gear"],
];
/**
 * Presenta el menú; su estado y las acciones pertenecen a Administrador.jsx.
 * NavLink calcula la opción activa a partir de la ruta, sin duplicar ese estado.
 * El logo procede de public/logo2.jpeg; BASE_URL respeta la base definida en Vite.
 * @param {object} props Propiedades de presentación y callbacks del contenedor.
 * @param {boolean} props.collapsed Indica si solo deben verse los iconos en escritorio.
 * @param {() => void} props.onToggle Alterna el menú contraído.
 * @param {() => void} props.onNewJob Abre el formulario global de trabajo.
 * @param {() => void} props.onHelp Abre el centro de ayuda.
 * @param {() => void} props.onLogout Solicita el cierre de sesión de demostración.
 * @param {() => void} props.onNavigate Cierra el menú móvil tras navegar.
 */
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
        <img
          className="sidebar-logo"
          src={`${import.meta.env.BASE_URL}logo2.jpeg`}
          alt="Logo de PrintSmart 3D"
          width="25"
          height="25"
        />
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
