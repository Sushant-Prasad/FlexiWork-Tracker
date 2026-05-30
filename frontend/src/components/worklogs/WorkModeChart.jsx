import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Building2, Wifi, Layers, PieChart } from "lucide-react";

ChartJS.register(ArcElement, Tooltip);

/*
==================================================
WORK MODE CHART
--------------------------------------------------
Purpose:
  Doughnut chart showing distribution of work
  modes (Office, Remote, Hybrid). Derived from
  the work log list — no extra API.

Props:
  - logs: array of work log objects
  - isLoading: boolean
==================================================
*/

const MODES = [
  {
    key: "OFFICE",
    label: "Office",
    icon: Building2,
    color: "#245BA7",      // --primary
    lightColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    key: "REMOTE",
    label: "Remote",
    icon: Wifi,
    color: "#3B82F6",      // --accent
    lightColor: "bg-accent/10",
    textColor: "text-accent",
  },
  {
    key: "HYBRID",
    label: "Hybrid",
    icon: Layers,
    color: "#93C5FD",      // light blue
    lightColor: "bg-primary/5",
    textColor: "text-muted-foreground",
  },
];

const WorkModeChart = ({ logs, isLoading }) => {
  if (isLoading) {
    return <div className="h-44 animate-pulse rounded-2xl bg-muted" />;
  }

  const validLogs = (logs || []).filter(
    (l) => l.actualMode && l.actualMode !== "UNLOGGED"
  );

  const counts = {
    OFFICE: validLogs.filter((l) => l.actualMode === "OFFICE").length,
    REMOTE: validLogs.filter((l) => l.actualMode === "REMOTE").length,
    HYBRID: validLogs.filter((l) => l.actualMode === "HYBRID").length,
  };

  const total = validLogs.length;
  const hasData = total > 0;

  const chartData = {
    datasets: [
      {
        data: hasData
          ? [counts.OFFICE, counts.REMOTE, counts.HYBRID]
          : [1, 1, 1],                   // placeholder when no data
        backgroundColor: hasData
          ? ["#245BA7", "#3B82F6", "#93C5FD"]
          : ["#EFF6FF", "#EFF6FF", "#EFF6FF"],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        hoverOffset: hasData ? 6 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: hasData,
        callbacks: {
          label: (ctx) => {
            const mode = MODES[ctx.dataIndex];
            return ` ${mode?.label}: ${counts[mode?.key]} day${counts[mode?.key] !== 1 ? "s" : ""}`;
          },
        },
        backgroundColor: "#FFFFFF",
        titleColor: "#0F172A",
        bodyColor: "#64748B",
        borderColor: "#DCE6F0",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

      {/* Doughnut */}
      <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hasData ? (
            <>
              <p className="text-2xl font-bold text-foreground leading-none">{total}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                days
              </p>
            </>
          ) : (
            <PieChart size={22} className="text-muted-foreground/40" />
          )}
        </div>
      </div>

      {/* Legend / Stats */}
      <div className="flex-1 space-y-3">
        {MODES.map(({ key, label, icon: Icon, color, lightColor, textColor }) => {
          const count = counts[key];
          const pct = hasData ? Math.round((count / total) * 100) : 0;
          return (
            <div key={key} className="flex items-center gap-3">
              {/* Icon pill */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${lightColor} ${textColor}`}>
                <Icon size={14} />
              </div>
              {/* Label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{label}</span>
                  <span className="text-xs font-semibold text-foreground">{count} days</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
              {/* Percentage */}
              <span className="w-9 text-right text-xs text-muted-foreground shrink-0">
                {pct}%
              </span>
            </div>
          );
        })}

        {!hasData && (
          <p className="text-xs text-muted-foreground pt-1">
            No work logs recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkModeChart;
