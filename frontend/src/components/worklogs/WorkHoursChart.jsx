import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

/*
==================================================
WORK HOURS CHART
--------------------------------------------------
Purpose:
  Line chart showing worked hours over the last
  N entries. Uses primary (#245BA7) from the theme.

Props:
  - logs: array of work log objects
  - isLoading: boolean
==================================================
*/

const WorkHoursChart = ({ logs, isLoading }) => {
  if (isLoading) {
    return <div className="h-52 animate-pulse rounded-2xl bg-muted" />;
  }

  const recent = [...(logs || [])].slice(0, 14).reverse();

  const data = {
    labels: recent.map((l) =>
      l.date
        ? new Date(l.date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : ""
    ),
    datasets: [
      {
        label: "Hours Worked",
        data: recent.map((l) => Number(l.workedHours || 0)),
        /* primary: #245BA7 */
        borderColor: "#245BA7",
        backgroundColor: "rgba(36, 91, 167, 0.12)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#245BA7",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} hrs`,
        },
        /* card: #FFFFFF, card-foreground: #0F172A */
        backgroundColor: "#FFFFFF",
        titleColor: "#0F172A",
        bodyColor: "#64748B",
        borderColor: "#DCE6F0",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 12,
        ticks: { color: "#64748B", font: { size: 11 }, stepSize: 2 },
        grid: { color: "rgba(220, 230, 240, 0.6)" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-52">
      <Line data={data} options={options} />
    </div>
  );
};

export default WorkHoursChart;
