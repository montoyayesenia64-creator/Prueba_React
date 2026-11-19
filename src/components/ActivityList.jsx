import { Icon, EmptyState } from "./UI";
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
