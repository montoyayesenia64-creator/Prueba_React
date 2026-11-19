import { Icon } from "./UI";
const placeholders = {
  dashboard: "Buscar pedidos, materiales o telemetría...",
  materiales: "Buscar materiales, lotes o proveedores...",
  pedidos: "Buscar pedidos, clientes o ID...",
  calculos: "Buscar proyectos o cálculos...",
  reportes: "Buscar reportes, transacciones o datos...",
  usuarios: "Buscar usuarios del sistema...",
  configuracion: "Buscar ajustes...",
};
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
