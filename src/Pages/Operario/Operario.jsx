import React from 'react';
import './Operario.css';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Calculator, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  AlertTriangle, 
  Wifi, 
  ChevronLeft 
} from 'lucide-react';

export default function OperarioDashboard() {
  return (
    <div className="operario-layout">
      
      {/* 1. BARRA LATERAL (SIDEBAR) */}
      <aside className="operario-sidebar">
        <div>
          {/* Logo y Nombre */}
          <div className="sidebar-header">
            <div className="brand-logo">
              <Package className="w-6 h-6" />
            </div>
            <span className="brand-title">PrintSmart 3D</span>
            <button className="sidebar-collapse-btn">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de Navegación */}
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>
            <a href="#" className="nav-item">
              <Package className="w-5 h-5" />
              Materiales
            </a>
            <a href="#" className="nav-item">
              <ClipboardList className="w-5 h-5" />
              Pedidos
            </a>
            <a href="#" className="nav-item">
              <Calculator className="w-5 h-5" />
              Cálculos
            </a>
            <a href="#" className="nav-item">
              <Settings className="w-5 h-5" />
              Configuración
            </a>
          </nav>
        </div>

        {/* Botón Cerrar sesión */}
        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="operario-main-container">
        
        {/* BARRA SUPERIOR (NAVBAR) */}
        <header className="operario-navbar">
          {/* Buscador */}
          <div className="search-container">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar pedidos o materiales..." 
              className="search-input"
            />
          </div>

          {/* Notificaciones y Usuario */}
          <div className="user-section">
            <button className="notification-btn">
              <Bell className="w-5 h-5" />
              <span className="notification-dot"></span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">C</div>
              <div className="user-info">
                <p className="user-name">Camiloarevalotic</p>
                <p className="user-role">OPERARIO</p>
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE TRABAJO DEL DASHBOARD */}
        <main className="operario-content">
          
          {/* Título de la sección */}
          <div className="content-header">
            <div>
              <h1 className="page-title">Dashboard Operativo</h1>
              <p className="page-subtitle">Centro de control de producción en tiempo real.</p>
            </div>
            <button className="primary-btn">
              <Plus className="w-5 h-5" />
              Nuevo Trabajo
            </button>
          </div>

          {/* GRILLA DE CONTENIDO (2 COLUMNAS) */}
          <div className="dashboard-grid">
            
            {/* COLUMNA IZQUIERDA: Alertas de Stock */}
            <div className="dashboard-card stock-column">
              <div className="card-header">
                <div className="card-title-group">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="card-title">Alertas de Stock</h2>
                </div>
                <span className="critical-badge">2 críticas</span>
              </div>

              <div className="alerts-list">
                {/* Alerta 1 */}
                <div className="alert-item red">
                  <div className="alert-info">
                    <div className="alert-icon-box red"><AlertTriangle className="w-4 h-4" /></div>
                    <div>
                      <h3>PLA Premium — Jet Black</h3>
                      <p>Stock: 80g · Mínimo requerido: 200g</p>
                    </div>
                  </div>
                  <button className="restock-btn">Reponer</button>
                </div>

                {/* Alerta 2 */}
                <div className="alert-item amber">
                  <div className="alert-info">
                    <div className="alert-icon-box amber"><AlertTriangle className="w-4 h-4" /></div>
                    <div>
                      <h3>PETG azul</h3>
                      <p>Reposición sugerida: 150g antes del lunes</p>
                    </div>
                  </div>
                  <button className="restock-btn">Reponer</button>
                </div>

                {/* Alerta 3 */}
                <div className="alert-item amber">
                  <div className="alert-info">
                    <div className="alert-icon-box amber"><AlertTriangle className="w-4 h-4" /></div>
                    <div>
                      <h3>PLA rojo</h3>
                      <p>Nivel bajo detectado: 120g restantes</p>
                    </div>
                  </div>
                  <button className="restock-btn">Reponer</button>
                </div>
              </div>

              <div className="view-all-container">
                <a href="#" className="view-all-link">ver todos →</a>
              </div>
            </div>

            {/* COLUMNA DERECHA: Sensores de Temperatura */}
            <div className="dashboard-card sensors-column">
              <div className="sensors-top-title">
                <Wifi className="w-4 h-4 text-purple-600" />
                <h2>ESTADO DE LA RED</h2>
              </div>
              <p className="sensors-subtitle">SENSORES DE TEMPERATURA</p>

              <div className="sensors-list">
                {/* Sensor 1 */}
                <div className="sensor-item">
                  <div className="sensor-header-row">
                    <span>Extrusor A1</span>
                    <span className="temp-value emerald">210°C</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill emerald" style={{ width: '85%' }}></div>
                  </div>
                  <div className="sensor-footer-row">
                    <span className="target-text">Target: 210°C</span>
                    <span className="status-pill emerald">Normal</span>
                  </div>
                </div>

                {/* Sensor 2 */}
                <div className="sensor-item">
                  <div className="sensor-header-row">
                    <span>Cama B4</span>
                    <span className="temp-value amber">62°C</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill amber" style={{ width: '65%' }}></div>
                  </div>
                  <div className="sensor-footer-row">
                    <span className="target-text">Target: 60°C</span>
                    <span className="status-pill amber">Revisar</span>
                  </div>
                </div>

                {/* Sensor 3 */}
                <div className="sensor-item">
                  <div className="sensor-header-row">
                    <span>Cámara</span>
                    <span className="temp-value blue">28°C</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill blue" style={{ width: '40%' }}></div>
                  </div>
                  <div className="sensor-footer-row">
                    <span className="target-text">Target: &lt;35°C</span>
                    <span className="status-pill blue">Óptimo</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>

      </div>
    </div>
  );
}