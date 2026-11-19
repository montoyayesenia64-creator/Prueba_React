/**
 * @file Componentes visuales reutilizables basados en clases de Bootstrap.
 * No conocen los registros del negocio: reciben contenido, estado y callbacks.
 */
import { useEffect, useRef } from "react";
/** Icono decorativo de Bootstrap Icons; el control que lo contiene aporta su nombre accesible. */
export function Icon({ name, className = "" }) {
  return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
/**
 * Botón con variante Bootstrap e icono opcional.
 * Por defecto type="button" evita envíos accidentales; ...props permite indicar
 * type="submit", onClick, disabled y atributos de accesibilidad cuando se necesitan.
 */
export function Button({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
/** Cabecera de página: título, subtítulo opcional y controles recibidos en children. */
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className={`page-heading ${subtitle ? "" : "compact"}`}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}
/**
 * Tarjeta de indicador: label describe value; tone y changeTone son clases de color.
 * change es una etiqueta visual que la página calcula o proporciona como ejemplo.
 * children permite incorporar contenido adicional, como una minigráfica.
 */
export function StatCard({
  label,
  value,
  icon,
  tone = "purple",
  change,
  changeTone = "green",
  children,
}) {
  return (
    <article className={`surface stat-card ${!icon ? "stat-compact" : ""}`}>
      <div className="stat-top">
        {icon && (
          <span className={`icon-tile ${tone}`}>
            <Icon name={icon} />
          </span>
        )}
        {change && <span className={`trend ${changeTone}`}>{change}</span>}
      </div>
      <p className="eyebrow">{label}</p>
      <div className="stat-value">{value}</div>
      {children}
    </article>
  );
}
/** Etiqueta breve para mostrar un estado con el color semántico indicado por tone. */
export function Badge({ children, tone = "purple" }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
/** Mensaje e icono para colecciones vacías o detalles todavía sin seleccionar. */
export function EmptyState({
  text = "No hay resultados para esta búsqueda.",
  icon = "search",
}) {
  return (
    <div className="empty-state">
      <Icon name={icon} />
      <p>{text}</p>
    </div>
  );
}
/**
 * Interruptor controlado: checked viene del padre y onChange recibe un booleano.
 * La etiqueta envuelve el input para que el texto también permita activarlo.
 */
export function Switch({ label, description, checked, onChange }) {
  return (
    <label className="switch-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
/**
 * Diálogo nativo: showModal() contiene el foco y crea el fondo de superposición.
 * Escape solicita onClose; el padre desmonta el componente para cerrar el diálogo.
 * Al desmontar devuelve el foco al elemento que estaba activo antes de abrirlo.
 * @param {object} props Contenido y control del diálogo.
 * @param {string} props.title Título vinculado al diálogo por aria-labelledby.
 * @param {import('react').ReactNode} props.children Cuerpo del diálogo.
 * @param {() => void} props.onClose Callback que actualiza el estado del padre.
 * @param {boolean} [props.wide=false] Activa la variante de mayor anchura.
 */
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  // Solo se abre al montar; la limpieza también permite trabajar con StrictMode.
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`app-dialog ${wide ? "wide" : ""}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-header">
        <h2 id="dialog-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Cerrar diálogo"
          onClick={onClose}
        >
          <Icon name="x-lg" />
        </button>
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
