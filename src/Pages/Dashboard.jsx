import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { initialMaterials } from "../data/initialData";
import {
  Button,
  PageHeader,
  StatCard,
  Modal,
  EmptyState,
} from "../components/UI";
import ActivityList from "../components/ActivityList";
import BarChart from "../components/BarChart";
import { exportPDF } from "../utils/export";
export default function Dashboard({ search, onHistory }) {
  const { orders, materials, activity, money, notify } = useAppData();
  const [days, setDays] = useState(30);
  const [dateOpen, setDateOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const addedRevenue = orders
    .filter((item) => item.status === "Completado")
    .reduce((sum, item) => sum + item.amount, 0);
  const active =
    25 +
    orders.filter((item) => !["Completado", "Rechazado"].includes(item.status))
      .length;
  const initialStock = initialMaterials
    .filter((item) => item.unit === "kg")
    .reduce((sum, item) => sum + item.stock, 0);
  const stock =
    428.5 +
    materials
      .filter((item) => item.unit === "kg")
      .reduce((sum, item) => sum + item.stock, 0) -
    initialStock;
  const factor = days / 30;
  const income = (28500000 + addedRevenue) * factor;
  const filteredActivity = activity.filter((item) =>
    `${item.title} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const matches = search.trim()
    ? [
        ...orders
          .filter((item) =>
            `${item.id} ${item.client} ${item.model}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((item) => ({
            text: `${item.id} • ${item.client} • ${item.model}`,
            path: "/pedidos",
          })),
        ...materials
          .filter((item) =>
            `${item.name} ${item.supplier}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((item) => ({
            text: `${item.name} • ${item.stock} ${item.unit}`,
            path: "/materiales",
          })),
      ]
    : [];
  const pdf = async () => {
    setExporting(true);
    try {
      await exportPDF("dashboard-printsmart", "Dashboard Ejecutivo", [
        `Periodo de demostración: últimos ${days} días`,
        `Ingresos totales: ${money(income, 0)}`,
        `Pedidos activos: ${active}`,
        `Stock: ${stock.toFixed(1)} kg`,
        "Salud del sistema: 99.8% (dato de demostración)",
        ...filteredActivity.map((item) => `${item.title}: ${item.description}`),
      ]);
      notify("Reporte PDF descargado.");
    } catch {
      notify("No se pudo generar el PDF.", "warning");
    } finally {
      setExporting(false);
    }
  };
  return (
    <>
      <PageHeader
        title="Dashboard Ejecutivo"
        subtitle="Analítica de precisión y visión general de fabricación en tiempo real."
      >
        <Button
          icon="calendar3"
          variant="outline-primary"
          onClick={() => setDateOpen(true)}
        >
          Últimos {days} Días
        </Button>
        <Button icon="download" disabled={exporting} onClick={pdf}>
          {exporting ? "Generando..." : "Exportar PDF"}
        </Button>
      </PageHeader>
      <div className="stats-grid">
        <StatCard
          label="Ingresos totales"
          value={money(income, 0)}
          icon="currency-dollar"
          change="+12.5%"
        />
        <StatCard
          label="Pedidos activos"
          value={`${active} Trabajos`}
          icon="printer"
          tone="blue"
          change="+4"
        />
        <StatCard
          label="Stock de material"
          value={`${stock.toFixed(1)} kg`}
          icon="box-seam"
          tone="orange"
          change="-8.2%"
          changeTone="red"
        />
        <StatCard
          label="Salud del sistema"
          value="99.8%"
          icon="shield-check"
          tone="green"
          change="Óptimo"
        />
      </div>
      {search.trim() && (
        <section className="surface search-results">
          <h2>Resultados de búsqueda</h2>
          {matches.length ? (
            matches.map((item) => (
              <Link key={item.text} to={item.path}>
                {item.text}
              </Link>
            ))
          ) : (
            <EmptyState />
          )}
        </section>
      )}
      <div className="dashboard-grid">
        <BarChart
          title="Crecimiento de Ingresos"
          labels={["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"]}
          max={160000}
          series={[
            {
              label: "Ingresos 2024",
              color: "#3e0969",
              values: [38000, 52000, 95000, 72000, 110000, 142000].map(
                (value) => value * factor,
              ),
            },
            {
              label: "Proyección",
              color: "#c5b4ff",
              values: [42000, 58000, 88000, 80000, 125000, 155000].map(
                (value) => value * factor,
              ),
            },
          ]}
        />
        <section className="surface recent-activity">
          <div className="card-heading">
            <h2>Actividad Reciente</h2>
            <button className="text-button" onClick={onHistory}>
              Ver Todo
            </button>
          </div>
          <ActivityList items={filteredActivity.slice(0, 5)} />
        </section>
      </div>
      {dateOpen && (
        <Modal title="Periodo del dashboard" onClose={() => setDateOpen(false)}>
          <p className="muted">
            Selecciona el periodo de los indicadores de demostración.
          </p>
          <div className="period-options">
            {[7, 30, 90].map((value) => (
              <Button
                variant={days === value ? "primary" : "outline-primary"}
                key={value}
                onClick={() => {
                  setDays(value);
                  setDateOpen(false);
                }}
              >
                Últimos {value} días
              </Button>
            ))}
          </div>
          <p className="field-help mt-3">
            La serie histórica de ejemplo se escala proporcionalmente al
            periodo.
          </p>
        </Modal>
      )}
    </>
  );
}
