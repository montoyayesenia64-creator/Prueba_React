/** @file Lista de eventos compartida por el dashboard, historial y notificaciones. */
import { Icon, EmptyState } from "./UI";
/**
 * Presenta los eventos en el orden recibido; no los consulta, filtra ni reordena.
 * El campo time es un texto proporcionado por los datos, no un reloj relativo.
 * @param {{items: Array<{id: string, title: string, description: string,
 * time: string, icon: string, tone: string}>}} props Eventos que se mostrarán.
 */
export default function ActivityList({ items }) {
  return items.length ? (
    <div className="activity-list">
      {items.map((item) => (
        <div className="activity-item" key={item.id}>
          <span className={`icon-tile small ${item.tone}`}>
            <Icon name={item.icon} />
          </span>
          <div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <small>{item.time}</small>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <EmptyState text="No hay actividad que coincida con la búsqueda." />
  );
}
