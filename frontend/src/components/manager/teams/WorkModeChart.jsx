import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const WorkModeChart = ({ snapshot, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 animate-pulse text-white">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="w-full h-48 bg-white/10 rounded"></div>
      </div>
    );
  }

  const members = snapshot?.members || [];

  // Count work modes
  const officeCount = members.filter((m) => m.actualMode === "OFFICE").length;
  const remoteCount = members.filter((m) => m.actualMode === "REMOTE").length;
  const hybridCount = members.filter((m) => m.actualMode === "HYBRID").length;
  const otherCount = members.filter(
    (m) => m.actualMode !== "OFFICE" && m.actualMode !== "REMOTE" && m.actualMode !== "HYBRID"
  ).length;

  const total = members.length || 1;

  const chartData = {
    labels: [
      `Office (${officeCount})`,
      `Remote (${remoteCount})`,
      `Hybrid (${hybridCount})`,
      `Other (${otherCount})`,
    ],
    datasets: [
      {
        data: [officeCount, remoteCount, hybridCount, otherCount],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(168, 85, 247, 0.7)", // Purple
          "rgba(34, 197, 94, 0.7)", // Green
          "rgba(203, 213, 225, 0.7)", // Gray
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(168, 85, 247)",
          "rgb(34, 197, 94)",
          "rgb(203, 213, 225)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgb(161, 170, 180)",
          font: {
            size: 12,
            weight: 500,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 text-white">
      <h3 className="text-lg font-semibold text-white mb-6">Work Mode Distribution</h3>
      <div style={{ maxHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {total > 0 ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <p className="text-zinc-400">No team members data available</p>
        )}
      </div>
    </div>
  );
};

export default WorkModeChart;
