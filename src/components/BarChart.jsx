/** @file Gráfico de barras agrupadas compartido por el dashboard y los informes. */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
// Chart.js requiere registrar las escalas y elementos que utilizará el gráfico.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
/**
 * Dibuja las series y una tabla equivalente accesible para lectores de pantalla.
 * Los valores de cada serie deben corresponder al orden de labels.
 * La altura depende de .chart-container; max sugiere un máximo, no recorta los datos.
 * @param {object} props Datos y presentación del gráfico.
 * @param {string} props.title Nombre visible y accesible del gráfico.
 * @param {string[]} props.labels Categorías del eje horizontal.
 * @param {{label: string, color: string, values: number[]}[]} props.series Series a comparar.
 * @param {number} [props.max] Máximo sugerido para la escala vertical.
 */
export default function BarChart({ title, labels, series, max }) {
  return (
    <section className="surface chart-card">
      <div className="card-heading">
        <h2>{title}</h2>
        <div className="chart-legend">
          {series.map((item) => (
            <span key={item.label}>
              <b style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="chart-container">
        <Bar
          aria-label={title}
          role="img"
          data={{
            labels,
            datasets: series.map((item) => ({
              label: item.label,
              data: item.values,
              backgroundColor: item.color,
              borderRadius: 5,
              barPercentage: 0.9,
              categoryPercentage: 0.76,
            })),
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { padding: 10, backgroundColor: "#23103d" },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: "#8a94a8", font: { size: 10 } },
                border: { color: "#e5e7eb" },
              },
              y: {
                beginAtZero: true,
                suggestedMax: max,
                grid: { color: "#f0f1f5" },
                border: { color: "#e5e7eb" },
                ticks: {
                  color: "#8a94a8",
                  font: { size: 10 },
                  maxTicksLimit: 9,
                },
              },
            },
          }}
        />
      </div>
      <table className="visually-hidden">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Periodo</th>
            {series.map((item) => (
              <th key={item.label}>{item.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={label}>
              <th>{label}</th>
              {series.map((item) => (
                <td key={item.label}>{item.values[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
