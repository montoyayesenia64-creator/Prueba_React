import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
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
