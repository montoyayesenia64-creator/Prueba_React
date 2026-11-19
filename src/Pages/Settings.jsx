/**
 * @file Preferencias monetarias/regionales, mantenimiento y almacenamiento de ejemplo.
 * Los formularios mantienen borradores; solo Guardar aplica esos cambios al contexto.
 */
import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { PageHeader, Button, Icon, Switch, EmptyState } from "../components/UI";
/** @param {{search: string}} props Búsqueda que muestra u oculta tarjetas de ajustes. */
export default function Settings({ search }) {
  const { settings, setSettings, notify, logActivity } = useAppData();
  const [currency, setCurrency] = useState(settings.currency);
  const [symbol, setSymbol] = useState(settings.symbol);
  const [language, setLanguage] = useState(settings.language);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [optimizing, setOptimizing] = useState(false);
  /** Compara la consulta con las palabras clave de cada tarjeta. */
  const matches = (text) => text.toLowerCase().includes(search.toLowerCase());
  /** Guarda denominación y símbolo sin aplicar un tipo de cambio a los importes. */
  const saveCurrency = (event) => {
    event.preventDefault();
    if (!symbol.trim()) return;
    setSettings({ ...settings, currency, symbol: symbol.trim() });
    notify("Moneda y símbolo guardados.");
  };
  /** Cambia los formatos de números/fechas; no traduce los textos de la interfaz. */
  const saveRegion = (event) => {
    event.preventDefault();
    setSettings({ ...settings, language, timezone });
    notify("Preferencias regionales guardadas.");
  };
  /**
   * Revisa CacheStorage y elimina únicamente cachés con prefijo printsmart-temp-.
   * No borra localStorage ni opera sobre un servidor; optimized cambia el medidor
   * ilustrativo de GB. Se notifica éxito incluso cuando no había cachés de ese tipo.
   */
  const optimize = async () => {
    setOptimizing(true);
    try {
      const cacheNames = "caches" in window ? await caches.keys() : [];
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith("printsmart-temp-"))
          .map((name) => caches.delete(name)),
      );
      setSettings((previous) => ({ ...previous, optimized: true }));
      logActivity(
        "Almacenamiento optimizado",
        "Limpieza de cachés temporales de PrintSmart",
        "device-hdd",
        "green",
      );
      notify("Caché temporal de PrintSmart revisada y optimizada.");
    } catch {
      notify("El navegador no permitió limpiar la caché.", "warning");
    } finally {
      setOptimizing(false);
    }
  };
  // Palabras clave para el filtro superior; cada índice corresponde a una tarjeta.
  const sections = [
    "moneda sistema símbolo costos facturación",
    "modo mantenimiento estado",
    "preferencias regionales idioma zona horaria",
    "almacenamiento sistema base datos modelos g-codes logs temporales optimizar",
  ];
  return (
    <>
      <PageHeader title="Configuración General" />
      <div className="settings-top-grid">
        {matches(sections[0]) && (
          <section className="surface currency-card">
            <form onSubmit={saveCurrency}>
              <div className="card-heading">
                <h2>
                  <span className="icon-tile purple">
                    <Icon name="currency-dollar" />
                  </span>
                  Configuración de Moneda
                </h2>
                <Button type="submit">Guardar Cambios</Button>
              </div>
              <p className="muted">
                Define la moneda principal para los cálculos de costos y
                facturación.
              </p>
              <div className="currency-fields">
                <label>
                  MONEDA DEL SISTEMA
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(event) => {
                      setCurrency(event.target.value);
                      setSymbol(event.target.value === "EUR" ? "€" : "$");
                    }}
                  >
                    <option value="COP">Peso Colombiano (COP)</option>
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="MXN">Peso Mexicano (MXN)</option>
                  </select>
                </label>
                <label>
                  SÍMBOLO
                  <input
                    required
                    maxLength="5"
                    className="form-control"
                    value={symbol}
                    onChange={(event) => setSymbol(event.target.value)}
                  />
                </label>
              </div>
            </form>
          </section>
        )}
        {matches(sections[1]) && (
          <section className="surface maintenance-card">
            <h2>
              <span className="icon-tile yellow">
                <Icon name="tools" />
              </span>
              Modo Mantenimiento
            </h2>
            <p className="muted">
              Al activar, usuarios no admin verán pantalla de mantenimiento.
            </p>
            <Switch
              label="Estado del Modo"
              checked={settings.maintenance}
              onChange={(value) => {
                setSettings({ ...settings, maintenance: value });
                notify(
                  value
                    ? "Modo mantenimiento activado para la sesión de demostración."
                    : "Modo mantenimiento desactivado.",
                );
              }}
            />
          </section>
        )}
      </div>
      <div className="settings-bottom-grid">
        {matches(sections[2]) && (
          <section className="surface regional-card">
            <h2>
              <span className="icon-tile blue">
                <Icon name="globe" />
              </span>
              Preferencias Regionales
            </h2>
            <form className="form-stack mt-4" onSubmit={saveRegion}>
              <label>
                IDIOMA DEL SISTEMA
                <select
                  className="form-select"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="es-CO">Español (Colombia)</option>
                  <option value="es-MX">Español (México)</option>
                  <option value="en-US">English (United States)</option>
                </select>
              </label>
              <label>
                ZONA HORARIA
                <select
                  className="form-select"
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                >
                  <option value="America/Bogota">
                    (UTC-05:00) Bogotá, Lima, Quito
                  </option>
                  <option value="America/Mexico_City">
                    (UTC-06:00) Ciudad de México
                  </option>
                  <option value="America/New_York">
                    Nueva York (con horario de verano)
                  </option>
                  <option value="Europe/Madrid">
                    Madrid (con horario de verano)
                  </option>
                  <option value="UTC">UTC</option>
                </select>
              </label>
              <Button type="submit" icon="save">
                Guardar Preferencias
              </Button>
            </form>
          </section>
        )}
        {matches(sections[3]) && (
          <section className="surface storage-card">
            <h2>
              <span className="icon-tile green">
                <Icon name="device-hdd" />
              </span>
              Almacenamiento del Sistema
            </h2>
            <div className="storage-meters">
              {[
                ["Base de Datos", "8.4 GB / 20 GB", 42, "purple"],
                ["Modelos y G-Codes", "125.6 GB / 500 GB", 25, "blue"],
                [
                  "Logs y Temporales",
                  settings.optimized ? "0.2 GB / 10 GB" : "1.2 GB / 10 GB",
                  settings.optimized ? 2 : 12,
                  "green",
                ],
              ].map(([label, value, percent, tone]) => (
                <div key={label}>
                  <div className="meter-label">
                    <span>{label}</span>
                    <span className={tone === "green" ? "text-success" : ""}>
                      {value}
                    </span>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={label}
                    aria-valuenow={percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className={`progress-bar ${tone}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="w-100"
              variant="outline-primary"
              icon="arrow-clockwise"
              disabled={optimizing}
              onClick={optimize}
            >
              {optimizing ? "Optimizando..." : "Optimizar Almacenamiento"}
            </Button>
          </section>
        )}
      </div>
      {!sections.some(matches) && (
        <EmptyState text="No se encontraron ajustes para esa búsqueda." />
      )}
    </>
  );
}
