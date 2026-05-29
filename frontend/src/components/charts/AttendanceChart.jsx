import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      ticks: { color: "#64748B" },
      grid: { display: false },
    },
    y: {
      ticks: { color: "#64748B" },
      grid: { color: "#E2E8F0" },
    },
  },
};

const AttendanceChart = ({ data }) => {
  return <Line data={data} options={options} />;
};

export default AttendanceChart;
