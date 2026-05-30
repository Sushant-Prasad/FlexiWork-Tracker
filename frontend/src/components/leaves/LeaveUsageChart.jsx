import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

/*
==================================================
LEAVE USAGE CHART
--------------------------------------------------
Purpose:
  Bar chart showing monthly approved leave days
  for the current year. Derived from the leave
  list — no extra API call required.

Props:
  - leaves: array of leave objects
  - isLoading: boolean

Colors:
  Uses CSS theme variable values directly inside
  Chart.js config — primary (#245BA7) and muted
  (#64748B) pulled from the design system.
==================================================
*/

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const getDayCount = (start, end) => {
  const diff =
    (new Date(end + "T00:00:00") - new Date(start + "T00:00:00")) /
    (1000 * 60 * 60 * 24);
  return diff + 1;
};

const LeaveUsageChart = ({ leaves, isLoading }) => {
  const currentYear = new Date().getFullYear();

  const monthlyData = useMemo(() => {
    const counts = Array(12).fill(0);
    (leaves || [])
      .filter(
        (l) =>
          l.status === "APPROVED" &&
          l.startDate?.startsWith(String(currentYear))
      )
      .forEach((l) => {
        const month = parseInt(l.startDate.split("-")[1], 10) - 1;
        counts[month] += getDayCount(l.startDate, l.endDate);
      });
    return counts;
  }, [leaves, currentYear]);

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Leave Days",
        data: monthlyData,
        /* primary color from --primary: #245BA7 */
        backgroundColor: monthlyData.map((v) =>
          v > 0 ? "rgba(36, 91, 167, 0.85)" : "rgba(36, 91, 167, 0.1)"
        ),
        hoverBackgroundColor: "rgba(36, 91, 167, 1)",
        borderRadius: 8,
        borderSkipped: false,
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
          label: (ctx) =>
            ` ${ctx.parsed.y} ${ctx.parsed.y === 1 ? "day" : "days"}`,
        },
        /* bg-card / card-foreground from theme */
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
        /* muted-foreground: #64748B */
        ticks: { color: "#64748B", font: { size: 12 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748B",
          font: { size: 12 },
          stepSize: 1,
          precision: 0,
        },
        /* border: #DCE6F0 */
        grid: { color: "rgba(220, 230, 240, 0.6)" },
        border: { display: false },
      },
    },
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
  }

  const totalDays = monthlyData.reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Approved leave days in {currentYear}
        </p>
        <p className="text-xs font-semibold text-foreground">
          {totalDays} {totalDays === 1 ? "day" : "days"} total
        </p>
      </div>
      <div className="h-48">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LeaveUsageChart;
