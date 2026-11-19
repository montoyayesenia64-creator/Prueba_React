import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Button, Icon, Modal } from "../../components/UI";
import ActivityList from "../../components/ActivityList";
import NewJobForm from "../../components/NewJobForm";
import { useAppData } from "../../context/AppContext";
import Dashboard from "../Dashboard";
import Materials from "../Materials";
import Orders from "../Orders";
import Calculator from "../Calculator";
import Reports from "../Reports";
import Users from "../Users";
import Settings from "../Settings";
import "./Administrador.css";

function readSession() {
  try {
    return sessionStorage.getItem("printsmart.signedout") !== "true";
  } catch {
    return true;
  }
}

export default function Administrador() {
  const { activity, users, settings, notify } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split("/")[1] || "dashboard";
  const [searches, setSearches] = useState({});
  const search = searches[section] || "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [signedIn, setSignedIn] = useState(readSession);
  const [previewRole, setPreviewRole] = useState("Admin");
  const user = users.find((item) => item.id === "USR-001") || {
    name: "Camilo Zambrano",
    email: "camilo@printsmart3d.com",
    role: "Admin",
  };
  const openSection = (path) => {
    navigate(path);
    setModal(null);
  };
  const signIn = () => {
    try {
      sessionStorage.removeItem("printsmart.signedout");
    } catch {
      /* La sesión continúa en memoria. */
    }
    setSignedIn(true);
    setPreviewRole("Admin");
    navigate("/dashboard");
  };
  const signOut = () => {
    try {
      sessionStorage.setItem("printsmart.signedout", "true");
    } catch {
      /* La sesión continúa en memoria. */
    }
    setSignedIn(false);
    setModal(null);
  };
  if (!signedIn)
    return (
      <div className="session-screen">
        <section className="surface session-card">
          <span className="brand-symbol large">
            <Icon name="printer" />
          </span>
          <h1>PrintSmart 3D</h1>
          <p className="muted">Gestión inteligente de impresión 3D</p>
          <p>
            La sesión de demostración está cerrada. Tus datos siguen guardados
            en este navegador.
          </p>
          <Button className="w-100" icon="box-arrow-in-right" onClick={signIn}>
            Entrar a la demostración
          </Button>
          <small className="field-help">
            Entorno local de demostración, sin credenciales de acceso.
          </small>
        </section>
      </div>
    );
  if (settings.maintenance && previewRole !== "Admin")
    return (
      <div className="session-screen">
        <section className="surface session-card">
          <span className="icon-tile yellow">
            <Icon name="tools" />
          </span>
          <h1>Estamos en mantenimiento</h1>
          <p className="muted">
            Volveremos pronto. Estamos preparando mejoras para tu experiencia de
            impresión.
          </p>
          <Button onClick={() => setPreviewRole("Admin")}>
            Volver a la vista de administrador
          </Button>
        </section>
      </div>
    );
  return (
    <div
      className={`admin-layout ${collapsed ? "menu-collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onNavigate={() => setMobileOpen(false)}
        onNewJob={() => setModal("newJob")}
        onHelp={() => setModal("help")}
        onLogout={() => setModal("logout")}
      />
      <div className="admin-main">
        <Topbar
          section={section}
          user={user}
          search={search}
          onSearch={(value) => setSearches({ ...searches, [section]: value })}
          onNotifications={() => setModal("notifications")}
          onHistory={() => setModal("history")}
          onProfile={() => setModal("profile")}
          onMenu={() => setMobileOpen(!mobileOpen)}
        />
        <main className="contenido-principal" id="contenido" tabIndex="-1">
          {settings.maintenance && (
            <div className="maintenance-banner">
              <Icon name="tools" />
              <span>
                Modo mantenimiento activo. Tu acceso de administrador sigue
                disponible.
              </span>
              <button
                className="text-button"
                onClick={() => setPreviewRole("Operador")}
              >
                Ver como visitante
              </button>
            </div>
          )}
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  search={search}
                  onHistory={() => setModal("history")}
                />
              }
            />
            <Route path="/materiales" element={<Materials search={search} />} />
            <Route path="/pedidos" element={<Orders search={search} />} />
            <Route path="/calculos" element={<Calculator search={search} />} />
            <Route path="/reportes" element={<Reports search={search} />} />
            <Route path="/usuarios" element={<Users search={search} />} />
            <Route
              path="/configuracion"
              element={<Settings search={search} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <footer className="content-footer">
            <span>
              PrintSmart 3D <span className="footer-divider">/</span> Entorno de
              demostración · Datos locales
            </span>
            <span>
              {new Intl.DateTimeFormat(settings.language, {
                timeZone: settings.timezone,
                dateStyle: "medium",
              }).format(new Date())}
            </span>
          </footer>
        </main>
      </div>
      {modal === "newJob" && (
        <Modal
          title="Nuevo Trabajo de Impresión"
          onClose={() => setModal(null)}
        >
          <NewJobForm onClose={() => setModal(null)} />
        </Modal>
      )}
      {(modal === "history" || modal === "notifications") && (
        <Modal
          title={
            modal === "history" ? "Historial de actividad" : "Notificaciones"
          }
          onClose={() => setModal(null)}
        >
          <ActivityList
            items={modal === "notifications" ? activity.slice(0, 6) : activity}
          />
        </Modal>
      )}
      {modal === "help" && (
        <Modal title="Centro de Ayuda" onClose={() => setModal(null)}>
          <div className="help-content">
            <p>Administra tu producción desde un solo lugar.</p>
            <h3>Materiales y pedidos</h3>
            <p>
              Registra suministros, filtra el inventario y selecciona un
              material para editarlo. En Pedidos, abre el detalle para aprobar,
              imprimir y finalizar un trabajo. Iniciar impresión descuenta el
              consumo estimado del inventario.
            </p>
            <h3>Cotizaciones</h3>
            <p>
              Carga un STL en milímetros o utiliza el modelo de referencia.
              Ajusta material, relleno, capa y mano de obra; descarga el PDF o
              crea un pedido.
            </p>
            <h3>Datos de demostración</h3>
            <p>
              Los cambios se guardan en este navegador. Los indicadores
              históricos, la telemetría y el almacenamiento son ejemplos. Las
              preferencias 2FA e IP no aplican controles de seguridad reales.
            </p>
            <h3>Preferencias regionales</h3>
            <p>
              El idioma configura el formato de números y fechas; la interfaz
              está en español. La moneda cambia el símbolo y la denominación,
              sin convertir precios.
            </p>
            <Button
              variant="outline-primary"
              icon="calculator"
              onClick={() => openSection("/calculos")}
            >
              Abrir calculadora
            </Button>
          </div>
        </Modal>
      )}
      {modal === "profile" && (
        <Modal title="Mi perfil" onClose={() => setModal(null)}>
          <div className="profile-modal">
            <span className="avatar">CZ</span>
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
            <span className="status-badge purple">Administrador</span>
          </div>
          <Button
            className="w-100 mt-4"
            icon="people"
            variant="outline-primary"
            onClick={() => openSection("/usuarios")}
          >
            Gestionar usuarios
          </Button>
        </Modal>
      )}
      {modal === "logout" && (
        <Modal title="Cerrar sesión" onClose={() => setModal(null)}>
          <p>
            Vas a cerrar la sesión de demostración. Los pedidos, materiales y
            preferencias permanecerán guardados.
          </p>
          <div className="dialog-actions">
            <Button variant="outline-secondary" onClick={() => setModal(null)}>
              Cancelar
            </Button>
            <Button
              icon="box-arrow-left"
              onClick={() => {
                signOut();
                notify("Sesión de demostración cerrada.");
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
