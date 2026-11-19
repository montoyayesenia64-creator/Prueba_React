import { useEffect, useRef } from "react";
export function Icon({ name, className = "" }) {
  return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
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
export function Badge({ children, tone = "purple" }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
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
/** Diálogo nativo: contiene el foco, admite Escape y devuelve el foco al cerrar. */
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
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
