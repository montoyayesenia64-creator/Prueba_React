/**
 * @file Gestión de pedidos y avance por revisión técnica, finanzas y producción.
 * Los pedidos se crean en NewJobForm; aquí se seleccionan, aprueban o rechazan.
 */
import { useState } from "react";
import { useAppData } from "../context/AppContext";
import {
  PageHeader,
  StatCard,
  Button,
  Badge,
  Icon,
  Modal,
  EmptyState,
} from "../components/UI";
import { exportCSV } from "../utils/export";
/** Relación entre estados del pedido y colores de sus etiquetas. */
const tones = {
  "Pendiente técnico": "purple",
  "Pendiente finanzas": "yellow",
  "En producción": "blue",
  Completado: "green",
  Rechazado: "red",
};
/** Cada estado editable define [texto de la acción, siguiente estado permitido por la UI]. */
const nextStatus = {
  "Pendiente técnico": ["Aprobar revisión técnica", "Pendiente finanzas"],
  "Pendiente finanzas": ["Aprobar e iniciar impresión", "En producción"],
  "En producción": ["Completar trabajo", "Completado"],
};
/** @param {{search: string}} props Búsqueda por ID, cliente, contacto o modelo. */
export default function Orders({ search }) {
  const {
    orders,
    setOrders,
    materials,
    setMaterials,
    money,
    notify,
    logActivity,
  } = useAppData();
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState("Todos");
  const [filterOpen, setFilterOpen] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  // El detalle se deriva del ID para reflejar los cambios de estado del contexto.
  const selected = orders.find((item) => item.id === selectedId);
  const filtered = orders.filter(
    (item) =>
      `${item.id} ${item.client} ${item.contact} ${item.model}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "Todos" || item.status === status),
  );
  const pending = orders.filter((item) =>
    item.status.startsWith("Pendiente"),
  ).length;
  const average = orders.length
    ? orders.reduce((sum, item) => sum + item.margin, 0) / orders.length
    : 0;
  const queue = orders.filter((item) => item.status === "En producción").length;
  /**
   * Actualiza el pedido seleccionado y registra el evento.
   * Al iniciar producción valida el material y descuenta el consumo estimado.
   * El flujo de UI evita repetir el inicio; no es una transacción de base de datos.
   * En una integración real, el servidor debe validar la transición y el stock juntos.
   * @param {string} newStatus Siguiente estado o Rechazado tras la confirmación.
   */
  const advance = (newStatus) => {
    if (newStatus === "En producción") {
      const material = materials.find(
        (item) => item.name === selected.material,
      );
      if (!material)
        return notify(
          "El material del pedido ya no está disponible.",
          "warning",
        );
      // Para resina se estima una densidad de 1.1 g/ml; filamento: g → kg.
      const consumption =
        selected.weight / (material.unit === "L" ? 1100 : 1000);
      if (material.stock < consumption)
        return notify(
          "Stock insuficiente. Repón el material antes de iniciar.",
          "warning",
        );
      setMaterials((previous) =>
        previous.map((item) =>
          item.id === material.id
            ? { ...item, stock: Math.max(0, item.stock - consumption) }
            : item,
        ),
      );
    }
    setOrders((previous) =>
      previous.map((item) =>
        item.id === selectedId ? { ...item, status: newStatus } : item,
      ),
    );
    logActivity(
      `${selected.id}: ${newStatus}`,
      `${selected.client} • ${selected.model}`,
      newStatus === "Rechazado" ? "x-circle" : "check-circle",
      newStatus === "Rechazado" ? "red" : "green",
    );
    notify(`Pedido ${selected.id}: ${newStatus.toLowerCase()}.`);
    setConfirmReject(false);
  };
  /** Descarga los pedidos que coinciden tanto con el estado como con la búsqueda. */
  const csv = () => {
    exportCSV(
      "pedidos-printsmart",
      ["ID", "Cliente", "Contacto", "Modelo", "Recargo (%)", "Estado", "Total"],
      filtered.map((item) => [
        item.id,
        item.client,
        item.contact,
        item.model,
        item.margin,
        item.status,
        item.amount,
      ]),
    );
    notify("Pedidos filtrados exportados.");
  };
  // La duración se suma para la cola activa; sin producción se muestra el ejemplo
  // 12h 45m. Las acciones finales no se ofrecen a pedidos completados o rechazados.
  return (
    <>
      <PageHeader
        title="Gestión de Pedidos"
        subtitle="Revisión técnica y financiera de solicitudes entrantes."
      >
        <Button
          variant="outline-primary"
          icon="funnel"
          onClick={() => setFilterOpen(true)}
        >
          Filtrar{status !== "Todos" ? " •" : ""}
        </Button>
        <Button icon="download" onClick={csv}>
          Exportar CSV
        </Button>
      </PageHeader>
      <div className="stats-grid orders-stats">
        <StatCard
          label="Pendientes de aprobación"
          value={pending}
          icon="clock"
          change="+12%"
        />
        <StatCard label="Margen promedio" value={`${average.toFixed(1)}%`} />
        <StatCard label="Cola de producción" value={`${queue} trabajos`} />
        <StatCard
          label="Tiempo estimado"
          value={
            queue
              ? `${orders
                  .filter((item) => item.status === "En producción")
                  .reduce((sum, item) => sum + item.hours, 0)
                  .toFixed(1)} h`
              : "12h 45m"
          }
        />
      </div>
      <div className="orders-grid">
        <section className="surface">
          <div className="table-responsive">
            <table className="table app-table orders-table">
              <thead>
                <tr>
                  <th>ID pedido</th>
                  <th>Cliente</th>
                  <th>Modelo</th>
                  <th>Margen</th>
                  <th>Estado</th>
                  <th>
                    <span className="visually-hidden">Ver detalle</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={selectedId === item.id ? "selected-row" : ""}
                  >
                    <td>
                      <button
                        className="table-link"
                        onClick={() => setSelectedId(item.id)}
                      >
                        #{item.id}
                      </button>
                    </td>
                    <td>
                      <strong>{item.client}</strong>
                      <small>{item.contact}</small>
                    </td>
                    <td>{item.model}</td>
                    <td>
                      <Badge tone={item.margin < 20 ? "red" : "green"}>
                        {item.margin.toFixed(1)}%
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={tones[item.status]}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={`Ver pedido ${item.id}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <Icon name="chevron-right" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <EmptyState />}
          </div>
        </section>
        <section
          className={`surface order-details ${!selected ? "unselected" : ""}`}
        >
          {!selected ? (
            <EmptyState
              text="Selecciona un pedido para ver sus detalles"
              icon="cursor-fill"
            />
          ) : (
            <>
              <div className="card-heading">
                <h2>Detalle del pedido #{selected.id}</h2>
                <button
                  className="icon-button"
                  aria-label="Cerrar detalle"
                  onClick={() => setSelectedId(null)}
                >
                  <Icon name="x-lg" />
                </button>
              </div>
              <Badge tone={tones[selected.status]}>{selected.status}</Badge>
              <dl className="detail-list mt-3">
                <div>
                  <dt>Cliente</dt>
                  <dd>{selected.client}</dd>
                </div>
                <div>
                  <dt>Modelo</dt>
                  <dd>{selected.model}</dd>
                </div>
                <div>
                  <dt>Material</dt>
                  <dd>{selected.material}</dd>
                </div>
                <div>
                  <dt>Consumo estimado</dt>
                  <dd>{selected.weight} g</dd>
                </div>
                <div>
                  <dt>Impresión</dt>
                  <dd>{selected.hours.toFixed(2)} h</dd>
                </div>
                <div>
                  <dt>Total cotizado</dt>
                  <dd>
                    <strong>{money(selected.amount)}</strong>
                  </dd>
                </div>
              </dl>
              <div className="form-stack">
                {nextStatus[selected.status] && (
                  <Button
                    icon="check2-circle"
                    onClick={() => advance(nextStatus[selected.status][1])}
                  >
                    {nextStatus[selected.status][0]}
                  </Button>
                )}
                {selected.status.startsWith("Pendiente") && (
                  <Button
                    variant="outline-danger"
                    icon="x-circle"
                    onClick={() => setConfirmReject(true)}
                  >
                    Rechazar pedido
                  </Button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      {filterOpen && (
        <Modal title="Filtrar pedidos" onClose={() => setFilterOpen(false)}>
          <label className="d-block">
            Estado del pedido
            <select
              className="form-select mt-2"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {["Todos", ...Object.keys(tones)].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <div className="dialog-actions">
            <Button
              variant="outline-primary"
              onClick={() => setStatus("Todos")}
            >
              Restablecer
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Aplicar filtro</Button>
          </div>
        </Modal>
      )}
      {confirmReject && (
        <Modal title="Rechazar pedido" onClose={() => setConfirmReject(false)}>
          <p>
            El pedido <strong>{selected.id}</strong> quedará rechazado y saldrá
            de la cola de aprobación.
          </p>
          <div className="dialog-actions">
            <Button
              variant="outline-secondary"
              onClick={() => setConfirmReject(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => advance("Rechazado")}>
              Rechazar pedido
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
