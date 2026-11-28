/**
 * @file Análisis financiero sobre la serie de demostración reportData de 2023.
 * Búsqueda, cliente y periodo determinan los importes, el gráfico y las exportaciones.
 */
import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { reportData } from "../data/initialData";
import {
  PageHeader,
  StatCard,
  Button,
  Modal,
  EmptyState,
} from "../components/UI";
import BarChart from "../components/BarChart";
import { exportExcel, exportPDF } from "../utils/export";
/** @param {{search: string}} props Texto que se cruza con cliente, mes y tipo de dato. */
export default function Reports({ search }) {
  const { money, notify } = useAppData();
  const [client, setClient] = useState("Todos los Clientes");
  const [period, setPeriod] = useState("Jul–Oct");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  // Q3 comprende julio-septiembre; Jul–Oct incluye toda la serie y Oct solo octubre.
  const filtered = reportData.filter(
    (item) =>
      (client === "Todos los Clientes" || client === item.client) &&
      (period === "Jul–Oct" ||
        (period === "Q3" ? item.month !== "Oct" : item.month === "Oct")) &&
      `${item.client} ${item.month} ingresos gastos`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  // Los totales se derivan del subconjunto visible, no del conjunto original.
  const total = filtered.reduce((sum, item) => sum + item.income, 0);
  const expenses = filtered.reduce((sum, item) => sum + item.expenses, 0);
  /** Descarga el análisis filtrado; finally libera el botón incluso si falla la descarga. */
  const pdf = async () => {
    setExporting(true);
    try {
      await exportPDF("analisis-printsmart", "Análisis de Desempeño", [
        `Periodo: ${period} 2023 / Cliente: ${client}`,
        `Ingresos: ${money(total)}`,
        `Gastos de material: ${money(expenses)}`,
        `Resultado: ${money(total - expenses)}`,
        ...filtered.map(
          (item) =>
            `${item.month} - ${item.client}: ingresos ${money(item.income)}, gastos ${money(item.expenses)}`,
        ),
        "Serie histórica de demostración. ROI y eficiencia son indicadores de ejemplo.",
      ]);
      notify("Reporte PDF descargado.");
    } catch {
      notify("No se pudo generar el PDF.", "warning");
    } finally {
      setExporting(false);
    }
  };
  // Excel usa las mismas filas que el PDF. ROI, desperdicio y eficiencia conservan
  // valores de ejemplo y no se recalculan al filtrar la serie financiera.
  return (
    <>
      <PageHeader
        title="Análisis de Desempeño"
        subtitle="Profundización operativa y financiera del Q3 2023."
      >
        <Button
          variant="outline-primary"
          icon="calendar3"
          onClick={() => setPeriodOpen(true)}
        >
          {period === "Jul–Oct"
            ? "01 Jul – 31 Oct"
            : period === "Q3"
              ? "01 Jul – 30 Sep"
              : "01 Oct – 31 Oct"}
        </Button>
        <select
          aria-label="Filtrar por cliente"
          className="form-select client-select"
          value={client}
          onChange={(event) => setClient(event.target.value)}
        >
          {[
            "Todos los Clientes",
            ...new Set(reportData.map((item) => item.client)),
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <Button
          variant="outline-primary"
          icon="file-earmark-excel"
          onClick={() => {
            exportExcel(
              "analisis-printsmart",
              ["Mes", "Cliente", "Ingresos", "Gastos", "Resultado"],
              filtered.map((item) => [
                item.month,
                item.client,
                item.income,
                item.expenses,
                item.income - item.expenses,
              ]),
            );
            notify("Archivo Excel XML descargado.");
          }}
        >
          Excel
        </Button>
        <Button icon="file-earmark-pdf" disabled={exporting} onClick={pdf}>
          {exporting ? "Generando..." : "Reporte PDF"}
        </Button>
      </PageHeader>
      <div className="stats-grid">
        <StatCard
          label="Ingresos totales"
          value={money(total, 0)}
          icon="currency-dollar"
          change="+12.5%"
        />
        <StatCard
          label="ROI promedio impresoras"
          value="2.4x"
          icon="lightning-charge"
          tone="green"
          change="Estable"
          changeTone="gray"
        />
        <StatCard
          label="Tasa de desperdicio"
          value="3.15%"
          icon="trash3"
          tone="red"
          change="-4.2%"
          changeTone="red"
        />
        <StatCard
          label="Eficiencia operativa"
          value="94.2%"
          icon="speedometer2"
          tone="blue"
          change="+8.1%"
        />
      </div>
      <div className="dashboard-grid">
        <BarChart
          title="Ingresos vs Gastos de Material"
          labels={filtered.map((item) => item.month)}
          max={200000}
          series={[
            {
              label: "Ingresos",
              color: "#210b3b",
              values: filtered.map((item) => item.income),
            },
            {
              label: "Gastos",
              color: "#8b53f6",
              values: filtered.map((item) => item.expenses),
            },
          ]}
        />
        <section className="surface roi-card">
          <h2>ROI por Impresora</h2>
          {[
            ["Heidelberg Speedmaster", 3.1],
            ["HP Indigo 12000", 2.8],
            ["Konica Minolta", 1.9],
            ["Canon imagePRESS", 1.4],
          ].map(([name, value]) => (
            <div className="roi-row" key={name}>
              <span>{name}</span>
              <div
                className="progress"
                role="progressbar"
                aria-label={`ROI de ${name}`}
                aria-valuenow={value}
                aria-valuemin="0"
                aria-valuemax="3.1"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${(value / 3.1) * 100}%` }}
                />
              </div>
              <strong>{value}x</strong>
            </div>
          ))}
        </section>
      </div>
      {!filtered.length && (
        <EmptyState text="No hay reportes para los filtros seleccionados." />
      )}
      {periodOpen && (
        <Modal title="Periodo del informe" onClose={() => setPeriodOpen(false)}>
          <div className="period-options">
            {[
              ["Jul–Oct", "Julio – Octubre 2023"],
              ["Q3", "Q3: Julio – Septiembre 2023"],
              ["Oct", "Octubre 2023"],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={period === value ? "primary" : "outline-primary"}
                onClick={() => {
                  setPeriod(value);
                  setPeriodOpen(false);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
