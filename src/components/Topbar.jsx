/** @file Barra superior compartida: buscador controlado, avisos y perfil. */
import { Icon } from "./UI";
// Ayudas del buscador según la sección; el filtrado se realiza en cada página.
const placeholders = {
  dashboard: "Buscar pedidos, materiales o telemetría...",
  materiales: "Buscar materiales, lotes o proveedores...",
  pedidos: "Buscar pedidos, clientes o ID...",
  calculos: "Buscar proyectos o cálculos...",
  reportes: "Buscar reportes, transacciones o datos...",
  usuarios: "Buscar usuarios del sistema...",
  configuracion: "Buscar ajustes...",
};
/**
 * Recibe el texto de búsqueda y comunica los cambios al layout administrador.
 * @param {object} props Estado y eventos suministrados por Administrador.jsx.
 * @param {string} props.section Identificador de la sección de la URL.
 * @param {string} props.search Texto actual del campo de búsqueda.
 * @param {(value: string) => void} props.onSearch Guarda el nuevo texto.
 * @param {() => void} props.onNotifications Abre notificaciones.
 * @param {() => void} props.onHistory Abre el historial completo.
 * @param {() => void} props.onProfile Abre el perfil del administrador.
 * @param {() => void} props.onMenu Alterna el panel de navegación móvil.
 * @param {{name: string, role: string}} props.user Perfil mostrado en la barra.
 */
export default function Topbar({
  section,
  search,
  onSearch,
  onNotifications,
  onHistory,
  onProfile,
  onMenu,
  user,
}) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button mobile-menu"
        aria-label="Abrir menú"
        onClick={onMenu}
      >
        <Icon name="list" />
      </button>
      <div className="buscador">
        <Icon name="search" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholders[section]}
          aria-label="Buscar en la sección"
        />
      </div>
      <div className="topbar-derecha">
        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Notificaciones"
          onClick={onNotifications}
        >
          <Icon name="bell" />
          <span className="notification-dot" />
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Historial de actividad"
          onClick={onHistory}
        >
          <Icon name="clock-history" />
        </button>
        <button
          type="button"
          className="usuario-perfil"
          onClick={onProfile}
          aria-label={`Ver perfil de ${user.name}`}
        >
          <span className="avatar">
            {user.name
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <span className="profile-info">
            <strong>{user.name}</strong>
            <small>{user.role.toUpperCase()}</small>
          </span>
        </button>
      </div>
    </header>
  );
}
