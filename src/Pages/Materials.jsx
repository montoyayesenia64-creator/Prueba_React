import { useState } from "react";
import { useAppData } from "../context/AppContext";
import {
  PageHeader,
  StatCard,
  Button,
  Badge,
  Modal,
  EmptyState,
} from "../components/UI";
import { exportCSV } from "../utils/export";
const blank = {
  name: "",
  type: "PLA",
  color: "#500088",
  stock: "1.0",
  price: "24.90",
  supplier: "",
  reorder: "3.0",
  expiry: "",
  unit: "kg",
};
const materialStatus = (item) =>
  item.stock < item.reorder
    ? ["Crítico", "red"]
    : item.stock <= item.reorder * 2
      ? ["Suficiente", "yellow"]
      : ["Óptimo", "green"];
export default function Materials({ search }) {
  const { materials, setMaterials, setOrders, money, notify, logActivity } =
    useAppData();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const filtered = materials.filter(
    (item) =>
      `${item.name} ${item.id} ${item.supplier} ${item.type}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (statusFilter === "Todos" || materialStatus(item)[0] === statusFilter) &&
      (typeFilter === "Todos" || item.type === typeFilter),
  );
  const value = materials.reduce(
    (sum, item) => sum + item.stock * item.price,
    0,
  );
  const critical = materials.filter((item) => item.stock < item.reorder).length;
  const expiring = materials.filter((item) => {
    const remaining =
      (new Date(`${item.expiry}T23:59:59`) - new Date()) / 86400000;
    return item.expiry && remaining <= 30;
  }).length;
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.supplier.trim())
      return notify("Completa el nombre y el proveedor.", "warning");
    if (
      materials.some(
        (item) =>
          item.id !== editing &&
          item.name.toLowerCase() === form.name.trim().toLowerCase(),
      )
    )
      return notify("Ya existe un material con ese nombre.", "warning");
    const item = {
      ...form,
      name: form.name.trim(),
      supplier: form.supplier.trim(),
      stock: Number(form.stock),
      price: Number(form.price),
      reorder: Number(form.reorder),
      detail: `${form.type} • ${form.unit === "kg" ? "Filamento" : "Resina"}`,
      id: editing || `MAT-${crypto.randomUUID().slice(0, 8)}`,
    };
    setMaterials((previous) =>
      editing
        ? previous.map((material) =>
            material.id === editing ? item : material,
          )
        : [...previous, item],
    );
    // Conserva la relación de los pedidos existentes cuando se renombra un material.
    if (editing) {
      const previousName = materials.find(
        (material) => material.id === editing,
      )?.name;
      setOrders((previous) =>
        previous.map((order) =>
          order.material === previousName
            ? { ...order, material: item.name }
            : order,
        ),
      );
    }
    logActivity(
      editing ? "Material actualizado" : "Nuevo material registrado",
      `${item.name} • ${item.stock} ${item.unit}`,
      "box-seam",
      "green",
    );
    notify(
      editing
        ? "Material actualizado."
        : "Material registrado en el inventario.",
    );
    setForm(blank);
    setEditing(null);
  };
  const edit = (item) => {
    setForm(item);
    setEditing(item.id);
    setSelected(null);
    document
      .getElementById("material-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const exportData = () => {
    exportCSV(
      "inventario-printsmart",
      [
        "ID",
        "Material",
        "Proveedor",
        "Stock",
        "Unidad",
        "Re-pedido",
        "Precio",
        "Estado",
        "Caducidad",
      ],
      filtered.map((item) => [
        item.id,
        item.name,
        item.supplier,
        item.stock,
        item.unit,
        item.reorder,
        item.price,
        materialStatus(item)[0],
        item.expiry,
      ]),
    );
    notify("Inventario filtrado exportado.");
  };
  return (
    <>
      <PageHeader
        title="Gestión Maestra de Materiales"
        subtitle="Gestión centralizada de stock, trazabilidad de consumos y control de caducidad."
      />
      <div className="stats-grid">
        <StatCard
          label="Valor total stock"
          value={money(value, 0)}
          icon="currency-dollar"
          change="+4.2%"
        />
        <StatCard
          label="Materiales críticos"
          value={`${critical} Materiales`}
          icon="exclamation-triangle"
          tone="yellow"
          change={`${critical} Críticos`}
          changeTone="red"
        />
        <StatCard
          label="Alertas caducidad"
          value={`${expiring} Lotes`}
          icon="clock-history"
          tone="red"
          change="Próximos 30d"
          changeTone="plain"
        />
        <StatCard label="Consumo proyectado" value="85 kg/mes">
          <div
            className="spark-bars"
            aria-label="Proyección mensual de ejemplo"
          >
            <b />
            <b />
            <b />
            <b />
          </div>
        </StatCard>
      </div>
      <div className="materials-grid">
        <section className="surface inventory-card">
          <div className="card-heading">
            <h2>
              Inventario Maestro{" "}
              <small className="online-label">
                <span className="status-dot" />
                Sistema Online
              </small>
            </h2>
            <div className="d-flex gap-2">
              <Button
                className="btn-sm"
                variant="outline-primary"
                icon="funnel"
                onClick={() => setFilterOpen(true)}
              >
                Filtros
                {statusFilter !== "Todos" || typeFilter !== "Todos" ? " •" : ""}
              </Button>
              <Button
                className="btn-sm"
                variant="outline-primary"
                icon="download"
                onClick={exportData}
              >
                Exportar
              </Button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table app-table inventory-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Proveedor</th>
                  <th>Stock</th>
                  <th>Re-pedido</th>
                  <th>Precio/kg</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const [label, tone] = materialStatus(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <button
                          className="material-link"
                          onClick={() => setSelected(item)}
                        >
                          <span
                            className="material-dot"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>
                            {item.name}
                            <small>{item.detail}</small>
                          </span>
                        </button>
                      </td>
                      <td>{item.supplier}</td>
                      <td className={tone === "red" ? "text-danger" : ""}>
                        {item.stock.toFixed(1)} {item.unit}
                      </td>
                      <td>
                        {item.reorder.toFixed(1)} {item.unit}
                      </td>
                      <td>{money(item.price)}</td>
                      <td>
                        <Badge tone={tone}>{label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filtered.length && <EmptyState />}
          </div>
          <p className="table-caption">
            {filtered.length} de {materials.length} materiales • Selecciona un
            material para editarlo.
          </p>
        </section>
        <section className="surface" id="material-form">
          <h2>{editing ? "Editar Material" : "Registrar Nuevo Material"}</h2>
          <p className="muted">
            Añada nuevos suministros al inventario global.
          </p>
          <form onSubmit={submit} className="form-stack">
            <label>
              Nombre del Material
              <input
                name="name"
                className="form-control"
                placeholder="Ej: PLA Silver Metallic"
                required
                maxLength="100"
                value={form.name}
                onChange={change}
              />
            </label>
            <div className="row g-2">
              <label className="col-6">
                Tipo
                <select
                  name="type"
                  className="form-select"
                  value={form.type}
                  onChange={change}
                >
                  {["PLA", "PETG", "ABS", "Resina", "Onyx", "Nylon"].map(
                    (type) => (
                      <option key={type}>{type}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="col-6">
                Color
                <div className="color-field">
                  <input
                    type="color"
                    name="color"
                    aria-label="Seleccionar color"
                    value={form.color}
                    onChange={change}
                  />
                  <input
                    className="form-control"
                    name="color"
                    pattern="#[0-9a-fA-F]{6}"
                    required
                    value={form.color}
                    onChange={change}
                    aria-label="Código hexadecimal del color"
                  />
                </div>
              </label>
              <label className="col-6">
                Peso / Vol (kg/L)
                <input
                  required
                  name="stock"
                  type="number"
                  min="0"
                  max="100000"
                  step="0.1"
                  className="form-control"
                  value={form.stock}
                  onChange={change}
                />
              </label>
              <label className="col-6">
                Precio / Kg o L
                <input
                  required
                  name="price"
                  type="number"
                  min="0.01"
                  max="1000000"
                  step="0.01"
                  className="form-control"
                  value={form.price}
                  onChange={change}
                />
              </label>
            </div>
            <label>
              Proveedor
              <input
                required
                name="supplier"
                className="form-control"
                placeholder="Nombre del proveedor"
                maxLength="100"
                value={form.supplier}
                onChange={change}
              />
            </label>
            <div className="row g-2">
              <label className="col-6">
                Punto de re-pedido
                <input
                  required
                  name="reorder"
                  type="number"
                  min="0.1"
                  max="100000"
                  step="0.1"
                  className="form-control"
                  value={form.reorder}
                  onChange={change}
                />
              </label>
              <label className="col-6">
                Unidad
                <select
                  name="unit"
                  className="form-select"
                  value={form.unit}
                  onChange={change}
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="L">Litros (L)</option>
                </select>
              </label>
            </div>
            <label>
              Fecha de caducidad
              <input
                name="expiry"
                type="date"
                className="form-control"
                value={form.expiry}
                onChange={change}
              />
            </label>
            <Button type="submit" icon={editing ? "floppy" : "plus-lg"}>
              {editing ? "Guardar Material" : "Registrar Material"}
            </Button>
            {editing && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setEditing(null);
                  setForm(blank);
                }}
              >
                Cancelar edición
              </Button>
            )}
          </form>
        </section>
      </div>
      {filterOpen && (
        <Modal
          title="Filtros de inventario"
          onClose={() => setFilterOpen(false)}
        >
          <div className="form-stack">
            <label>
              Estado
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {["Todos", "Óptimo", "Suficiente", "Crítico"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select
                className="form-select"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                {["Todos", "PLA", "PETG", "ABS", "Resina", "Onyx", "Nylon"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </label>
            <div className="dialog-actions">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setTypeFilter("Todos");
                  setStatusFilter("Todos");
                }}
              >
                Restablecer
              </Button>
              <Button onClick={() => setFilterOpen(false)}>
                Ver resultados
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <dl className="detail-list">
            <div>
              <dt>Proveedor</dt>
              <dd>{selected.supplier}</dd>
            </div>
            <div>
              <dt>Stock disponible</dt>
              <dd>
                {selected.stock} {selected.unit}
              </dd>
            </div>
            <div>
              <dt>Precio por {selected.unit}</dt>
              <dd>{money(selected.price)}</dd>
            </div>
            <div>
              <dt>Caducidad</dt>
              <dd>{selected.expiry || "Sin fecha"}</dd>
            </div>
          </dl>
          <Button icon="pencil" onClick={() => edit(selected)}>
            Editar material
          </Button>
        </Modal>
      )}
    </>
  );
}
